import styled from 'styled-components';
import {
  Dispatch,
  JSX,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePCBuildSceneBuilder } from '@/PCBuildSceneBuilder';
import { PCCModel } from '@/runtime/PCCModel';
import { ToggleTarget } from '@/runtime/ToggleTarget';
import { PCCRuntime } from '@/runtime/PCCRuntime';
import { MountPoint } from '@/runtime/MountPoint';
import { MPNameMap } from '@/Constants';
import { verticalUiSize, horizontalUiSize } from '..';
import { ComponentListPanel } from './ComponentListPanel';
import { LoadingScreen } from './LoadingScreen';

const PCCUIRootDiv = styled.div`
  background-color: #020617;
  @media screen and (orientation: portrait) {
    width: 100%;
    height: ${() => verticalUiSize};
  }
  @media screen and (orientation: landscape) {
    width: ${() => horizontalUiSize};
    height: 100%;
  }
  position: relative;
  overflow: hidden;
`;

const PcComponentsListDiv = styled.div`
  background-color: #0f172a;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: 5px;
`;

const TreeItemDiv = styled.div`
  padding: 5px;
  padding-bottom: 0;
  box-sizing: border-box;
  width: 100%;
  flex: 0 0 45px;
  flex-direction: column;
  text-align: left; /* Alterado de center para left */
  vertical-align: middle;
  user-select: none;
  transition: 0.2s;

  &:hover {
    background-color: #334155;
  }
`;

const TreeItemInnerDiv = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center; /* Corrigido de 'left' para 'center' */
  background-color: #2563eb;
  color: white;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  padding: 0 10px;
  box-sizing: border-box;
`;

const TreeItemDropdownToggleDiv = styled.div`
  width: 40px;
  text-align: center;
  align-items: center;
  background-color: #1d4ed8;
  color: white;
  font-weight: bold;
  font-size: 20px;
  position: relative;
`;

const TreeItemTitleInnerDiv = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Garante que o contêiner flex alinhe à esquerda */
  text-align: left; /* Alinha o texto à esquerda */
  padding-left: 12px;
`;

const TreeItemDisposeButtonDiv = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fca5a5;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
  }
`;

const TreeItemToggleOuterDiv = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px;
  box-sizing: border-box;
`;

const TreeItemTogglesContainerDiv = styled.div`
  border-style: solid;
  border-width: 2px;
  border-color: #1e293b;
  border-top-width: 0;
`;

interface TreeItemToggleDivProps {
  $enabled: boolean;
}

const TreeItemToggleDiv = styled.div<TreeItemToggleDivProps>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #334155;
  color: white;
  opacity: ${props => (props.$enabled ? 1 : 0.5)};
  transition: opacity 0.2s;
`;

const ToggleNameMp: Record<string, string | undefined> = {
  drive_holder: 'Painel Lateral do Case (Traseiro)',
  front_panel: 'Painel Frontal do Case',
  side_armour: 'Parafusos do Case',
  side_glass: 'Painel Lateral do Case (Frontal)',
  power_nail: 'Parafusos da Power Supply',
};

const TreeViewRerenderContext = createContext<() => void>(() => {});

interface TreeItemToggleProps {
  toggleTarget: ToggleTarget;
}

function TreeItemToggle(props: TreeItemToggleProps): JSX.Element {
  const { toggleTarget } = props;

  const rerender = useContext(TreeViewRerenderContext);

  const onToggle = useCallback(() => {
    toggleTarget.setEnabled(!toggleTarget.enabled);
    rerender();
  }, [toggleTarget, rerender]);

  return (
    <TreeItemToggleOuterDiv>
      <TreeItemToggleDiv onClick={onToggle} $enabled={toggleTarget.enabled}>
        {ToggleNameMp[toggleTarget.name] || toggleTarget.name}
      </TreeItemToggleDiv>
    </TreeItemToggleOuterDiv>
  );
}

const TreeItemContentOuterDiv = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
`;

const VerticalLineDiv = styled.div`
  width: 5px;
  height: 100%;
  margin-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  box-sizing: border-box;
  background-color: #334155;
  border-radius: 40px;
`;

const TreeItemContentDiv = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
`;

const EmptyMountPointDiv = styled.div`
  padding: 5px;
  padding-bottom: 0;
  box-sizing: border-box;
  width: 100%;
  flex: 0 0 45px;
  flex-direction: column;
  text-align: center;
  vertical-align: middle;
`;

const EmptyMountPointInnerDiv = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #1e293b;
  color: white;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #334155;
  }
`;

const MountPointNameDiv = styled.div`
  font-weight: normal;
  font-size: 16px;
  padding-left: 10px;
`;

const MountPointAttachHintDiv = styled.div`
  font-size: 12px;
  font-weight: normal;
  color: #d8d8d8;
  padding-right: 10px;
  cursor: pointer;
`;

interface EmptyMountPointProps {
  mountPoint: MountPoint | 'root';
  onClick: (mountPoint: MountPoint | 'root') => void;
}

function EmptyMountPoint(props: EmptyMountPointProps): JSX.Element {
  const { mountPoint, onClick } = props;

  const innerName =
    typeof mountPoint === 'string' ? mountPoint : mountPoint.name;

  const name = MPNameMap[innerName] || innerName;

  return (
    <EmptyMountPointDiv key={name}>
      <EmptyMountPointInnerDiv onClick={() => onClick(mountPoint)}>
        <MountPointNameDiv>{name}</MountPointNameDiv>
        <MountPointAttachHintDiv>
          Clique para carregar novo componente
        </MountPointAttachHintDiv>
      </EmptyMountPointInnerDiv>
    </EmptyMountPointDiv>
  );
}

const PCCRuntimeContext = createContext<PCCRuntime | undefined>(undefined);

interface TreePCCViewProps {
  model: PCCModel;
  onClickEmptyMountPoint: (mountPoint: MountPoint | 'root') => void;
}

function TreePCCView(props: TreePCCViewProps): JSX.Element {
  const { model, onClickEmptyMountPoint } = props;

  const rerender = useContext(TreeViewRerenderContext);
  const runtime = useContext(PCCRuntimeContext);

  const [isShowingToggleTargets, setIsShowingToggleTargets] = useState(false);

  const onDispose = useCallback(() => {
    model.onDisposeObservable.addOnce(() => runtime?.disposeUnboundedModels());
    model.dispose();
    rerender();
  }, [model, runtime, rerender]);

  return (
    <>
      <TreeItemDiv>
        <TreeItemInnerDiv>
          {model.toggleTargets.length > 0 ? (
            <TreeItemDropdownToggleDiv
              onClick={() => setIsShowingToggleTargets(!isShowingToggleTargets)}
            >
              {isShowingToggleTargets ? '▼' : '▶'}
            </TreeItemDropdownToggleDiv>
          ) : null}
          <TreeItemTitleInnerDiv>{model.name}</TreeItemTitleInnerDiv>
          <TreeItemDisposeButtonDiv onClick={onDispose}>
            ✖
          </TreeItemDisposeButtonDiv>
        </TreeItemInnerDiv>
        {isShowingToggleTargets ? (
          <TreeItemTogglesContainerDiv>
            {model.toggleTargets.map(toggleTarget => (
              <TreeItemToggle
                key={toggleTarget.name}
                toggleTarget={toggleTarget}
              />
            ))}
          </TreeItemTogglesContainerDiv>
        ) : null}
      </TreeItemDiv>
      {model.mountPoints.length > 0 ? (
        <TreeItemContentOuterDiv>
          <VerticalLineDiv />
          <TreeItemContentDiv>
            {model.mountPoints.map(mountPoint =>
              mountPoint.attachedModel ? (
                <TreePCCView
                  key={mountPoint.name}
                  model={mountPoint.attachedModel}
                  onClickEmptyMountPoint={onClickEmptyMountPoint}
                />
              ) : (
                <EmptyMountPoint
                  key={mountPoint.name}
                  mountPoint={mountPoint}
                  onClick={onClickEmptyMountPoint}
                />
              ),
            )}
          </TreeItemContentDiv>
        </TreeItemContentOuterDiv>
      ) : null}
    </>
  );
}

export default function PCCUIRoot(props: {
  percent: number;
  setPrecent: Dispatch<SetStateAction<number>>;
}): JSX.Element {
  const { percent, setPrecent } = props;
  const builder = usePCBuildSceneBuilder();

  const [isInitialized, setIsInitialized] = useState(false);
  const [_, setRerenderState] = useState(false);

  const [baseModel, setBaseModel] = useState<PCCModel | undefined>(undefined);

  const onBaseModelChanged = useCallback((model: PCCModel | undefined) => {
    setBaseModel(model);
  }, []);

  const [selectedTarget, setSelectedTarget] = useState<MountPoint | 'root'>();
  // Crie ou ajuste a função para alternar o estado de seleção
  const handleMountPointClick = useCallback(
    (mountPoint: MountPoint | 'root') => {
      if (mountPoint === 'root' || builder === undefined) {
        setSelectedTarget(prev => (prev === 'root' ? undefined : 'root'));
        return;
      }

      // 1. Descobre qual é a primeira peça compatível com este slot/mountPoint
      // (Procuramos com base nas regras de compatibilidade do slot)
      const slotName = mountPoint.name.toLowerCase();
      let defaultUrl = 'res/120mm_fan_sample.glb'; // Valor padrão de segurança

      if (slotName.includes('ram')) {
        defaultUrl = 'res/ddr4_ram_sample.glb';
      } else if (
        slotName.includes('storage') ||
        slotName.includes('ssd') ||
        slotName.includes('drive')
      ) {
        defaultUrl = 'res/nvme_ssd_sample.glb'; // ou sata_ssd_sample dependendo do slot
      } else if (slotName.includes('cpu')) {
        defaultUrl = 'res/cpu_sample.glb';
      } else if (slotName.includes('gpu') || slotName.includes('pcie')) {
        defaultUrl = 'res/gpu_sample.glb';
      } else if (slotName.includes('fan')) {
        defaultUrl = 'res/120mm_fan_sample.glb';
      } else if (slotName.includes('cooler')) {
        defaultUrl = 'res/cooler_sample.glb';
      } else if (slotName.includes('power')) {
        defaultUrl = 'res/atx_power_sample.glb';
      } else if (slotName.includes('motherboard')) {
        defaultUrl = 'res/atx_motherboard_sample.glb';
      }

      const runtime = builder.runtime;

      // 2. Instala a peça imediatamente com apenas um clique, sem abrir menus!
      (async () => {
        try {
          const model = await runtime.addModel(defaultUrl);
          if (model && mountPoint.attach(model)) {
            setRerenderState(x => !x);
          } else if (model) {
            model.dispose(true);
          }
        } catch (error) {
          console.error('Erro ao adicionar componente automaticamente:', error);
        }
      })();
    },
    [builder],
  );

  const onComponentSelected = useCallback(
    (modelUrl: string | undefined) => {
      if (builder === undefined || selectedTarget === undefined) {
        return;
      }

      const currentTarget = selectedTarget;
      setSelectedTarget(undefined);

      if (modelUrl === undefined) {
        return;
      }

      // Memoriza qual peça foi usada neste slot
      if (currentTarget !== 'root') {
        setLastAddedModels(prev => ({
          ...prev,
          [currentTarget.name]: modelUrl,
        }));
      }

      const runtime = builder.runtime;

      (async () => {
        try {
          const model = await runtime.addModel(modelUrl);
          if (model === undefined) {
            return;
          }

          if (currentTarget === 'root') {
            runtime.setBaseModel(model);
            runtime.disposeUnboundedModels();
            setRerenderState(x => !x);
            return;
          }

          if (!currentTarget.attach(model)) {
            model.dispose(true);
          }
          setRerenderState(x => !x);
        } catch (error) {
          console.error('Erro ao carregar componente:', error);
        }
      })();
    },
    [builder, selectedTarget],
  );

  useEffect(() => {
    if (builder === undefined) {
      return;
    }

    if (isInitialized) {
      return;
    }

    setIsInitialized(true);

    const runtime = builder.runtime;
    runtime.playAnimation();

    runtime.onBaseModelChangedObservable.add(onBaseModelChanged);

    function increaseTo(end: number) {
      return new Promise<void>(resolve => {
        const id = setInterval(function () {
          setPrecent(prev => {
            if (prev >= end) {
              clearInterval(id);
              resolve();
              return prev;
            }
            return prev + 1;
          });
        }, 100);
      });
    }

    (async () => {
      const [caseModel] = await Promise.all([
        runtime.addModel('res/case_sample.glb'),
        increaseTo(70),
      ]);

      runtime.setBaseModel(caseModel!);

      const [motherBorardModel] = await Promise.all([
        runtime.addModel('res/atx_motherboard_sample.glb'),
        increaseTo(80),
      ]);

      const [coolerModel] = await Promise.all([
        runtime.addModel('res/cooler_sample.glb'),
        increaseTo(85),
      ]);

      const [gpuModel] = await Promise.all([
        runtime.addModel('res/gpu_sample.glb'),
        increaseTo(90),
      ]);

      const [powserSupplyModel] = await Promise.all([
        runtime.addModel('res/atx_power_sample.glb'),
        increaseTo(95),
      ]);

      const [fanModel] = await Promise.all([
        runtime.addModel('res/120mm_fan_sample.glb'),
        increaseTo(97),
      ]);

      const fanModels: PCCModel[] = [fanModel!];
      for (let i = 0; i < 4; ++i) {
        const fanModel = await runtime.addModel('res/120mm_fan_sample.glb')!;
        fanModels.push(fanModel!);
      }

      const [ramModel] = await Promise.all([
        runtime.addModel('res/ddr4_ram_sample.glb'),
        increaseTo(99),
      ]);

      const ramModels: PCCModel[] = [ramModel!];
      for (let i = 0; i < 1; ++i) {
        const ramModel = (await runtime.addModel('res/ddr4_ram_sample.glb'))!;
        ramModels.push(ramModel);
      }

      // Substitua a linha antiga de storageModel por isto:
      const [cpuModel, storageModel] = await Promise.all([
        runtime.addModel('res/cpu_sample.glb'),
        runtime.addModel('res/nvme_ssd_sample.glb'),
        increaseTo(100),
      ]);

      const storageModels: PCCModel[] = [storageModel!];
      const extraStorage = await runtime.addModel('res/nvme_ssd_sample.glb');
      if (extraStorage) {
        storageModels.push(extraStorage);
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      {
        let fanModelIndex = 0;
        const mountPoints = caseModel!.mountPoints;
        for (let i = 0; i < mountPoints.length; ++i) {
          const mountPoint = mountPoints[i];
          if (mountPoint.attach(fanModels[fanModelIndex])) {
            fanModelIndex += 1;
            await new Promise(resolve => setTimeout(resolve, 200));
          }

          if (fanModelIndex >= fanModels.length) {
            break;
          }
        }
      }

      {
        const mountPoints = caseModel!.mountPoints;
        for (let i = 0; i < mountPoints.length; ++i) {
          const mountPoint = mountPoints[i];
          if (mountPoint.attach(powserSupplyModel!)) {
            break;
          }
        }
      }

      {
        const mountPoints = caseModel!.mountPoints;
        for (let i = 0; i < mountPoints.length; ++i) {
          const mountPoint = mountPoints[i];
          if (mountPoint.attach(motherBorardModel!)) {
            await new Promise(resolve => setTimeout(resolve, 200));
            break;
          }
        }
      }

      {
        const mountPoints = motherBorardModel!.mountPoints;
        for (let i = 0; i < mountPoints.length; ++i) {
          const mountPoint = mountPoints[i];
          if (mountPoint.attach(cpuModel!)) {
            await new Promise(resolve => setTimeout(resolve, 200));
            break;
          }
        }
      }

      {
        const mountPoints = motherBorardModel!.mountPoints;
        for (let i = 0; i < mountPoints.length; ++i) {
          const mountPoint = mountPoints[i];
          if (mountPoint.attach(coolerModel!)) {
            await new Promise(resolve => setTimeout(resolve, 200));
            break;
          }
        }
      }

      {
        let ramModelIndex = 0;
        const mountPoints = motherBorardModel!.mountPoints;
        for (let i = 0; i < mountPoints.length; ++i) {
          const mountPoint = mountPoints[i];
          if (mountPoint.attach(ramModels[ramModelIndex])) {
            ramModelIndex += 1;
            await new Promise(resolve => setTimeout(resolve, 200));
          }

          if (ramModelIndex >= ramModels.length) {
            break;
          }
        }
      }

      {
        const mountPoints = motherBorardModel!.mountPoints;
        for (let i = 0; i < mountPoints.length; ++i) {
          const mountPoint = mountPoints[i];
          if (mountPoint.attach(storageModel!)) {
            await new Promise(resolve => setTimeout(resolve, 200));
            break;
          }
        }
      }

      {
        const mountPoints = motherBorardModel!.mountPoints;
        for (let i = 0; i < mountPoints.length; ++i) {
          const mountPoint = mountPoints[i];
          if (mountPoint.attach(storageModel!)) {
            await new Promise(resolve => setTimeout(resolve, 200));
            break;
          }
        }
      }

      {
        const mountPoints = motherBorardModel!.mountPoints;
        for (let i = 0; i < mountPoints.length; ++i) {
          const mountPoint = mountPoints[i];
          if (mountPoint.attach(gpuModel!)) {
            await new Promise(resolve => setTimeout(resolve, 200));
            break;
          }
        }
      }

      setRerenderState(x => !x);
    })();
  }, [builder, isInitialized, onBaseModelChanged, setPrecent]);

  const loadingScreen = useMemo(() => {
    return <LoadingScreen isShowing={Boolean(percent < 100)} />;
  }, [percent]);

  return (
    <PCCUIRootDiv>
      <PcComponentsListDiv>
        <TreeViewRerenderContext.Provider
          value={() => setRerenderState(x => !x)}
        >
          <PCCRuntimeContext.Provider value={builder?.runtime}>
            {baseModel ? (
              <TreePCCView
                model={baseModel}
                onClickEmptyMountPoint={handleMountPointClick}
              />
            ) : (
              <EmptyMountPoint
                mountPoint="root"
                onClick={handleMountPointClick}
              />
            )}
          </PCCRuntimeContext.Provider>
        </TreeViewRerenderContext.Provider>
      </PcComponentsListDiv>
      <ComponentListPanel
        target={selectedTarget}
        onSelected={onComponentSelected}
      />
      {loadingScreen}
    </PCCUIRootDiv>
  );
}
function setLastAddedModels(_arg0: (prev: any) => any) {
  throw new Error('Function not implemented.');
}
