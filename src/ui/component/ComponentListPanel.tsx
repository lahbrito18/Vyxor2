import styled from 'styled-components';
import { JSX } from 'react';
import { Compatibility } from '@/loader/Compatibility';
import { MountPoint } from '@/runtime/MountPoint';
import { MPNameMap } from '@/Constants';

interface ComponentListPanelDivProps {
  $isShowing: boolean;
}

const ComponentListPanelDiv = styled.div<ComponentListPanelDivProps>`
  position: absolute;
  top: 0;
  left: 0;

  width: 280px;
  height: 100%;

  background-color: #0f172a;

  display: flex;
  flex-direction: column;

  transform: ${props =>
    props.$isShowing ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease;

  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
`;

const ComponentListPanelTopBarDiv = styled.div`
  width: 100%;
  flex: 0 0 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #1e293b;
  color: white;
`;

const ComponentListPanelTopBarBackButtonDiv = styled.div`
  width: 40px;
  text-align: center;
  align-items: center;
  background-color: #1e293b;
  color: white;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
`;

const ComponentListPanelTopBarTitleDiv = styled.div`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  padding-right: 40px;
  flex: 1;
`;

const ComponentListPanelListPaddingDiv = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const ComponentListPanelListDiv = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
`;

const ComponentListItemDiv = styled.div`
  padding: 5px;
  padding-bottom: 0;
  box-sizing: border-box;
  width: 100%;
  flex: 0 0 45px;
  flex-direction: column;
  text-align: center;
`;

const ComponentListItemInnerDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #334155;
  color: white;

  font-weight: bold;
  font-size: 14px;

  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #475569;
  }
`;

interface ComponentListPanelProps {
  target: MountPoint | 'root' | undefined;
  onSelected: (modelUrl: string | undefined) => void;
}

interface ComponentListItemInfo {
  name: string;
  url: string;
  compat: Compatibility | undefined;
}

const listItems: ComponentListItemInfo[] = [
  {
    name: 'Gabinete',
    url: 'res/case_sample.glb',
    compat: Compatibility.parseFromCompatString('case'),
  },
  {
    name: 'Ventoinha 120mm',
    url: 'res/120mm_fan_sample.glb',
    compat: Compatibility.parseFromCompatString('fan,120'),
  },
  {
    name: 'Fonte ATX',
    url: 'res/atx_power_sample.glb',
    compat: Compatibility.parseFromCompatString('powersupply,ATX'),
  },
  {
    name: 'Placa-mãe ATX',
    url: 'res/atx_motherboard_sample.glb',
    compat: Compatibility.parseFromCompatString('motherboard,ATX'),
  },
  {
    name: 'Processador Intel',
    url: 'res/cpu_sample.glb',
    compat: Compatibility.parseFromCompatString('cpu,LGA1700'),
  },
  {
    name: 'Cooler',
    url: 'res/cooler_sample.glb',
    compat: Compatibility.parseFromCompatString('cooler,LGA1700'),
  },
  {
    name: 'Memória RAM DDR4',
    url: 'res/ddr4_ram_sample.glb',
    compat: Compatibility.parseFromCompatString('ram,DDR4'),
  },
  {
    name: 'Placa de Vídeo (GPU)',
    url: 'res/gpu_sample.glb',
    compat: Compatibility.parseFromCompatString('pcie,x16'),
  },
  {
    name: 'SSD NVMe',
    url: 'res/nvme_ssd_sample.glb',
    compat: Compatibility.parseFromCompatString('storage,NVMESSD'),
  },
];

for (let i = 0; i < listItems.length; ++i) {
  const item = listItems[i];
  if (item.compat === undefined) {
    throw new Error(`Erro ao processar compatibilidade de ${item.name}`);
  }
}

export function ComponentListPanel(
  props: ComponentListPanelProps,
): JSX.Element {
  const { target, onSelected } = props;

  return (
    <ComponentListPanelDiv $isShowing={target !== undefined}>
      <ComponentListPanelTopBarDiv>
        <ComponentListPanelTopBarBackButtonDiv
          onClick={() => onSelected(undefined)}
        >
          ◀
        </ComponentListPanelTopBarBackButtonDiv>

        <ComponentListPanelTopBarTitleDiv>
          Adicionar à posição{' '}
          {target === 'root'
            ? 'Raiz'
            : MPNameMap[target?.name || ''] || target?.name}
        </ComponentListPanelTopBarTitleDiv>
      </ComponentListPanelTopBarDiv>

      <ComponentListPanelListPaddingDiv>
        <ComponentListPanelListDiv>
          {target !== undefined
            ? (target === 'root'
                ? listItems
                : listItems.filter(item => {
                    const points = target.points;

                    let isCompatible = false;
                    for (let i = 0; i < points.length; ++i) {
                      const point = points[i];
                      if (
                        target.checkPointAvailability(i) &&
                        point.compatability.isCompatibleWith(item.compat!)
                      ) {
                        isCompatible = true;
                        break;
                      }
                    }
                    return isCompatible;
                  })
              ).map(item => (
                <ComponentListItemDiv key={item.name}>
                  <ComponentListItemInnerDiv
                    onClick={() => onSelected(item.url)}
                  >
                    {item.name}
                  </ComponentListItemInnerDiv>
                </ComponentListItemDiv>
              ))
            : null}
        </ComponentListPanelListDiv>
      </ComponentListPanelListPaddingDiv>
    </ComponentListPanelDiv>
  );
}
