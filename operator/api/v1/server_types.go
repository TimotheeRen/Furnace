package v1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type ServerSpec struct {
	// +required
	InitContainer *string `json:"initContainer"`
	// +required
	RequestMemory *string `json:"requestMemory"`
	// +required
	RequestCPU *string `json:"requestCPU"`
	// +required
	LimitMemory *string `json:"limitMemory"`
	// +required
	Storage *string `json:"storage"`
	// +required
	LimitCPU *string `json:"limitCPU"`
}

type ServerStatus struct {
	// +listType=map
	// +listMapKey=type
	// +optional
	Conditions []metav1.Condition `json:"conditions,omitempty"`
}

// +kubebuilder:object:root=true
// +kubebuilder:subresource:status

type Server struct {
	metav1.TypeMeta `json:",inline"`
	// +optional
	metav1.ObjectMeta `json:"metadata,omitzero"`
	// +required
	Spec ServerSpec `json:"spec"`
	// +optional
	Status ServerStatus `json:"status,omitzero"`
}

// +kubebuilder:object:root=true

type ServerList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitzero"`
	Items           []Server `json:"items"`
}

func init() {
	SchemeBuilder.Register(&Server{}, &ServerList{})
}
