from diagrams import Cluster, Diagram
from diagrams.programming.framework import Nextjs
from diagrams.programming.language import Go
from diagrams.onprem.inmemory import Redis
from diagrams.k8s.others import CRD
from diagrams.k8s.network import Service
from diagrams.k8s.compute import StatefulSet, Pod
from diagrams.k8s.storage import PV, PVC

graph_attr = {
    "bgcolor": "transparent",
}

with Diagram(outformat="svg"):
    with Cluster("CRs"):
        crs = [CRD("Server 1"),
               CRD("Server 2"),
               CRD("Server 3") ]
    with Cluster("Server 1"):
        server = Service("server-svc") >> StatefulSet("server")
    Nextjs("UI") >> Go("API") >> Redis("Message broker") >> Go("Controller/Server") >> crs >> Go("K8S Operator") >> server
