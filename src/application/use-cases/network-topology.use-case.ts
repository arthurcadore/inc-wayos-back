import { Inject, Injectable } from '@nestjs/common';
import { CommonTopoLink, CommonTopoNode } from 'src/modules/inccloud/dto/inccloud-response.dto';
import { INC_CLOUD_CONSTANTS } from 'src/modules/inccloud/inc-cloud.constants';
import type { IncCloudServiceInterface } from "src/modules/inccloud/interfaces/inccloud-service.interface";
import { DeviceType, PortConnection, TopologyNode } from './dto/network-topology.dto';

@Injectable()
export class NetworkTopologyUseCase {
    routerNode: TopologyNode = {
        id: 'router-1',
        name: 'Router',
        model: 'Model XPTO',
        type: DeviceType.ROUTER,
        ports: [],
    };

    constructor(
        @Inject(INC_CLOUD_CONSTANTS.INC_CLOUD_SERVICE)
        private readonly incCloudService: IncCloudServiceInterface
    ) { }

    async execute(shopId: number): Promise<TopologyNode[]> {
        const nodesPromise = this.incCloudService.commonTopoNodes(shopId);
        const linksPromise = this.incCloudService.commonTopoLinks(shopId);
        const [devices, linksData] = await Promise.all([nodesPromise, linksPromise]);

        const switchDevices = devices.filter(node => node.type === 'switch');
        const accessPointDevices = devices.filter(node => node.type === 'cloudap');
        const stationDevices = devices.filter(node => node.type === 'station');

        const switchNodes: TopologyNode[] = switchDevices.map(device => ({
            id: device.identity.toString(),
            name: device.name || '(n/d)',
            model: device.model || '(n/d)',
            type: DeviceType.SWITCH,
            ports: this.parserPorts(linksData.links, device),

            sn: device.sn,
            mac: device.mac,
            isOnline: device.onlineStatus === 1,
            manageIp: device.manageIp,
            portInfo: device.portInfo,
        }));

        const accessPointNodes: TopologyNode[] = accessPointDevices.map(device => ({
            id: device.identity.toString(),
            name: device.name || '(n/d)',
            model: device.model || '(n/d)',
            type: DeviceType.ACCESS_POINT,
            ports: this.parserPorts(linksData.links, device),
            sn: device.sn,
            mac: device.mac,
            isOnline: device.onlineStatus === 1,
            manageIp: device.manageIp,
            portInfo: device.portInfo,
        }));

        const stationNodes: TopologyNode[] = stationDevices.map(device => ({
            id: device.identity.toString(),
            name: device.name || '(n/d)',
            model: device.model || '(n/d)',
            type: DeviceType.STATION,
            ports: this.parserPorts(linksData.links, device),
        }));

        const results: TopologyNode[] = [
            this.routerNode,
            ...switchNodes,
            ...accessPointNodes,
            ...stationNodes,
        ];

        return results;
    }

    addPortInRouter(identityId: string) {
        this.routerNode.ports.push({ portName: '', connectedToDeviceId: identityId, connectedToPort: '' });
    }

    parserPorts(links: CommonTopoLink[], device: CommonTopoNode): PortConnection[] {
        if (device.type === 'switch') {
            const commonTopoLinks = links.filter(link => link.srcId === device.identity);
            const ports: PortConnection[] = commonTopoLinks.map(link => ({
                portName: link.srcPort,
                connectedToDeviceId: link.desId.toString(),
                connectedToPort: link.desPort || 'ETH0',
            } as PortConnection));

            this.addPortInRouter(device.identity.toString());

            return [
                { portName: '', connectedToDeviceId: this.routerNode.id, connectedToPort: '' },
                ...ports,
            ];
        } else if (device.type === 'cloudap') {
            const commonTopoLinks = links.filter(link => link.srcId === device.identity);
            const ports: PortConnection[] = commonTopoLinks.map(link => {
                const linkFind = links.find(l => l.desId === link.srcId);

                if (!linkFind) { // Neste caso access point está conectado diretamente no roteador
                    this.addPortInRouter(device.identity.toString());
                    return {
                        portName: '',
                        connectedToDeviceId: this.routerNode.id,
                        connectedToPort: '',
                    } as PortConnection;
                }

                return {
                    portName: linkFind.desPort,
                    connectedToDeviceId: linkFind.srcId.toString(),
                    connectedToPort: linkFind.srcPort,
                } as PortConnection;
            });
            return ports;
        } else if (device.type === 'station') {
            const commonTopoLinks = links.filter(link => link.srcId === device.identity);
            const ports: PortConnection[] = commonTopoLinks.map(link => {
                const linkFind = links.find(l => l.desId === link.srcId);

                if (!linkFind) { // Neste caso estação está conectada diretamente no roteador
                    this.addPortInRouter(device.identity.toString());
                    return {
                        portName: '',
                        connectedToDeviceId: this.routerNode.id,
                        connectedToPort: '',
                    } as PortConnection;
                }

                return {
                    portName: 'ETH0',
                    connectedToDeviceId: linkFind.srcId.toString(),
                    connectedToPort: linkFind.srcPort,
                } as PortConnection;
            });
            return ports;
        } else {
            throw new Error(`Tipo de dispositivo desconhecido: ${device.type}`);
        }
    }
}
