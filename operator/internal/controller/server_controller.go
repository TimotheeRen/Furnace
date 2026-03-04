package controller

import (
	"context"

	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	apierrors "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/intstr"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	logf "sigs.k8s.io/controller-runtime/pkg/log"

	furnacecomv1 "github.com/timotheeren/furnace/api/v1"
)

// ServerReconciler reconciles a Server object
type ServerReconciler struct {
	client.Client
	Scheme *runtime.Scheme
}

// +kubebuilder:rbac:groups=furnace.com,resources=servers,verbs=get;list;watch;create;update;patch;delete
// +kubebuilder:rbac:groups=furnace.com,resources=servers/status,verbs=get;update;patch
// +kubebuilder:rbac:groups=furnace.com,resources=servers/finalizers,verbs=update

func (r *ServerReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	log := logf.FromContext(ctx)

	servers := &furnacecomv1.Server{}
	err := r.Get(ctx, types.NamespacedName{Name: req.Name, Namespace: req.Namespace}, servers)
	if err != nil {
		if apierrors.IsNotFound(err) {
			return ctrl.Result{}, nil
		}
		return ctrl.Result{}, err
	}
	svc := &corev1.Service{}
	serviceName := servers.Name + "-svc"
	err = r.Get(ctx, types.NamespacedName{Name: serviceName, Namespace: servers.Namespace}, svc)
	if err != nil {
		if apierrors.IsNotFound(err) {
			log.Info("Resource 'Service' not found.")
			return ctrl.Result{}, r.Create(ctx, r.defineService(servers))
		}
		return ctrl.Result{}, err
	}

	ss := &appsv1.StatefulSet{}
	err = r.Get(ctx, types.NamespacedName{Name: req.Name, Namespace: req.Namespace}, ss)
	if err != nil && apierrors.IsNotFound(err) {
		log.Info("Resource 'StatefulSet' not found.")
		err = r.Create(ctx, r.defineStatefulSet(servers))
		if err != nil {
			return ctrl.Result{}, err
		}
		return ctrl.Result{Requeue: true}, nil
	}

	updated := false
	container := &ss.Spec.Template.Spec.Containers[0]

	current := container.Resources.Requests[corev1.ResourceMemory]
	desired := resource.MustParse(*servers.Spec.RequestMemory)
	if !current.Equal(desired) {
		container.Resources.Requests[corev1.ResourceMemory] = desired
		updated = true
		log.Info("RequestMemory updated.")
	}

	current = container.Resources.Requests[corev1.ResourceCPU]
	desired = resource.MustParse(*servers.Spec.RequestCPU)
	if !current.Equal(desired) {
		container.Resources.Requests[corev1.ResourceCPU] = desired
		updated = true
		log.Info("RequestCPU updated.")
	}

	current = container.Resources.Limits[corev1.ResourceMemory]
	desired = resource.MustParse(*servers.Spec.LimitMemory)
	if !current.Equal(desired) {
		container.Resources.Limits[corev1.ResourceMemory] = desired
		updated = true
		log.Info("LimitMemory updated.")
	}

	current = container.Resources.Limits[corev1.ResourceCPU]
	desired = resource.MustParse(*servers.Spec.LimitCPU)
	if !current.Equal(desired) {
		container.Resources.Limits[corev1.ResourceCPU] = desired
		updated = true
		log.Info("LimitCPU updated.")
	}

	if updated {
		log.Info("Applying updates to Statefulset resources.")
		err = r.Update(ctx, ss)
		if err != nil {
			log.Error(err, "Can't update 'Statefulset'")
			return ctrl.Result{}, err
		}
		return ctrl.Result{}, nil
	}

	return ctrl.Result{}, nil
}

// SetupWithManager sets up the controller with the Manager.
func (r *ServerReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&furnacecomv1.Server{}).
		Owns(&corev1.Service{}).
		Owns(&appsv1.StatefulSet{}).
		Named("server").
		Complete(r)
}

func (r *ServerReconciler) defineStatefulSet(server *furnacecomv1.Server) *appsv1.StatefulSet {
	reqMem := resource.MustParse(*server.Spec.RequestMemory)
	reqCPU := resource.MustParse(*server.Spec.RequestCPU)
	limMem := resource.MustParse(*server.Spec.LimitMemory)
	limCPU := resource.MustParse(*server.Spec.LimitCPU)
	volumeStorage := resource.MustParse(*server.Spec.Storage)

	initCmd := `if [ ! -f /server/.initialized ]; then
	cp -r /data/. /server && touch /server/.initialized
	else echo 'Already initialized'; fi
	`

	ss := &appsv1.StatefulSet{
		ObjectMeta: metav1.ObjectMeta{
			Name:      server.Name,
			Namespace: server.Namespace,
		},
		Spec: appsv1.StatefulSetSpec{
			ServiceName: server.Name,
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{"app": server.Name},
			},
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{"app": server.Name},
				},
				Spec: corev1.PodSpec{
					InitContainers: []corev1.Container{
						{
							Name:    "init-container",
							Image:   *server.Spec.InitContainer,
							Command: []string{"sh", "-c", initCmd},
							VolumeMounts: []corev1.VolumeMount{
								{
									Name:      "server-data",
									MountPath: "/server",
								},
							},
						},
					},
					Containers: []corev1.Container{
						{
							Name:  "server-container",
							Image: *server.Spec.LauncherContainer,
							Ports: []corev1.ContainerPort{
								{
									Name:          "minecraft",
									ContainerPort: 25565,
									Protocol:      corev1.ProtocolTCP,
								},
							},
							VolumeMounts: []corev1.VolumeMount{
								{
									Name:      "server-data",
									MountPath: "/server",
								},
							},
							Resources: corev1.ResourceRequirements{
								Requests: corev1.ResourceList{
									corev1.ResourceMemory: reqMem,
									corev1.ResourceCPU:    reqCPU,
								},
								Limits: corev1.ResourceList{
									corev1.ResourceMemory: limMem,
									corev1.ResourceCPU:    limCPU,
								},
							},
						},
						{
							Name:  "sftp-sidecar",
							Image: "atmoz/sftp:alpine-3.7",
							Args:  []string{"$(SFTP_USERNAME):$(SFTP_PASSWORD):1000:1000"},
							Env: []corev1.EnvVar{
								{
									Name: "SFTP_PASSWORD",
									ValueFrom: &corev1.EnvVarSource{
										SecretKeyRef: &corev1.SecretKeySelector{
											LocalObjectReference: corev1.LocalObjectReference{
												Name: "sftp-credentials",
											},
											Key: "password",
										},
									},
								},
								{
									Name: "SFTP_USERNAME",
									ValueFrom: &corev1.EnvVarSource{
										SecretKeyRef: &corev1.SecretKeySelector{
											LocalObjectReference: corev1.LocalObjectReference{
												Name: "sftp-credentials",
											},
											Key: "username",
										},
									},
								},
							},
							Ports: []corev1.ContainerPort{
								{
									Name:          "sftp",
									ContainerPort: 22,
									Protocol:      corev1.ProtocolTCP,
								},
							},
							VolumeMounts: []corev1.VolumeMount{
								{
									Name:      "server-data",
									MountPath: "/home/admin/upload",
								},
							},
						},
					},
				},
			},
			VolumeClaimTemplates: []corev1.PersistentVolumeClaim{
				{
					ObjectMeta: metav1.ObjectMeta{
						Name: "server-data",
					},
					Spec: corev1.PersistentVolumeClaimSpec{
						AccessModes: []corev1.PersistentVolumeAccessMode{corev1.ReadWriteOnce},
						Resources: corev1.VolumeResourceRequirements{
							Requests: corev1.ResourceList{
								corev1.ResourceStorage: volumeStorage,
							},
						},
					},
				},
			},
		},
	}

	err := ctrl.SetControllerReference(server, ss, r.Scheme)
	if err != nil {
		return nil
	}
	return ss
}

func (r *ServerReconciler) defineService(server *furnacecomv1.Server) *corev1.Service {
	svc := &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      server.Name + "-svc",
			Namespace: server.Namespace,
		},
		Spec: corev1.ServiceSpec{
			Selector: map[string]string{"app": server.Name},
			Ports: []corev1.ServicePort{
				{
					Name:       "minecraft",
					Protocol:   corev1.ProtocolTCP,
					Port:       25565,
					TargetPort: intstr.FromInt(25565),
				},
				{
					Name:       "sftp",
					Protocol:   corev1.ProtocolTCP,
					Port:       22,
					TargetPort: intstr.FromInt(22),
				},
			},
			Type: corev1.ServiceTypeNodePort,
		},
	}
	err := ctrl.SetControllerReference(server, svc, r.Scheme)
	if err != nil {
		return nil
	}
	return svc
}
