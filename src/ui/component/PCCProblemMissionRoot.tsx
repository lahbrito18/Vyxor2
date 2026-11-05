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
import { LoadingScreen } from './LoadingScreen';

const PCCProblemMissionRootDiv = styled.div`
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
  text-align: center;
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
  align-items: center;
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
  align-content: center;
  text-align: right;
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

const ToggleNameMp: Record<string, string> = {
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
    <TreeItemToggleOuterDiv onClick={onToggle}>
      <TreeItemToggleDiv $enabled={toggleTarget.enabled}>
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
    <EmptyMountPointDiv>
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
    model.onDisposeObservable.addOnce(() => {
      runtime?.disposeUnboundedModels();
      rerender();
    });

    model.dispose();
  }, [model, runtime, rerender]);

  const ComponentNameMap: Record<string, string> = {
    case_sample: 'Gabinete',
    atx_motherboard_sample: 'Placa-mãe',
    cooler_sample: 'Cooler',
    gpu_sample: 'Placa de vídeo',
    atx_power_sample: 'Fonte',
    ddr4_ram_sample: 'Memória RAM',
    cpu_sample: 'Processador',
    nvme_ssd_sample: 'SSD NVMe',
    sata_ssd_sample: 'SSD SATA',
    '120mm_fan_sample': 'Ventoinha 120 mm',
  };

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
          ) : (
            <TreeItemDropdownToggleDiv />
          )}

          <TreeItemTitleInnerDiv>
            {ComponentNameMap[model.name] || model.name}
          </TreeItemTitleInnerDiv>

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

const GlobalMissionOverlay = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  width: min(420px, calc(100vw - 32px));
  padding: 16px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.28);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);
  color: white;
`;

export default function PCCProblemMissionRoot(props: {
  percent: number;
  setPrecent: Dispatch<SetStateAction<number>>;
  onBack?: () => void;
}): JSX.Element {
  const { percent, setPrecent, onBack } = props;
  const builder = usePCBuildSceneBuilder();

  const [isInitialized, setIsInitialized] = useState(false);
  const [rerenderState, setRerenderState] = useState(false);
  const [baseModel, setBaseModel] = useState<PCCModel | undefined>(undefined);
  const [, setSelectedTarget] = useState<MountPoint | 'root' | undefined>();
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [isMissionAlertOpen, setIsMissionAlertOpen] = useState(false);
  const [missionAlertData, setMissionAlertData] = useState<{
    pendingVisible: { id: string; label: string; done: boolean }[];
    pendingHidden: { label: string; done: boolean }[];
  }>({ pendingVisible: [], pendingHidden: [] });

  const onBaseModelChanged = useCallback((model: PCCModel | undefined) => {
    setBaseModel(model);
  }, []);

  const normalizeModelName = (name?: string) =>
    (name || '').trim().toLowerCase();

  const isModelAlive = (model?: PCCModel) => {
    if (!model) return false;

    const anyModel = model as PCCModel & {
      disposed?: boolean;
      isDisposed?: boolean;
      _disposed?: boolean;
    };

    return !anyModel.disposed && !anyModel.isDisposed && !anyModel._disposed;
  };

  const refreshMissionState = () => {
    setRerenderState(prev => !prev);
  };

  const missionState = useMemo(() => {
    const installedNames: string[] = [];

    function collectNames(model?: PCCModel) {
      if (!model || !isModelAlive(model)) return;

      installedNames.push(normalizeModelName(model.name));

      model.mountPoints.forEach(mp => {
        if (mp?.attachedModel && isModelAlive(mp.attachedModel)) {
          collectNames(mp.attachedModel);
        }
      });
    }

    collectNames(baseModel);

    const matches = (pattern: string, name: string) =>
      normalizeModelName(name).includes(pattern);

    const countOf = (pattern: string) =>
      installedNames.filter(name => matches(pattern, name)).length;

    const hasOneOf = (...patterns: string[]) =>
      installedNames.some(name => patterns.some(p => matches(p, name)));

    const ramCount = countOf('ddr4_ram') || countOf('ram');
    const fanCount = countOf('120mm_fan') || countOf('fan');

    const hasCase = hasOneOf('case_sample', 'case');
    const hasMotherboard = hasOneOf('atx_motherboard', 'motherboard');
    const hasCooler = hasOneOf('cooler_sample', 'cooler');
    const hasPowerSupply = hasOneOf('atx_power', 'power', 'powersupply');
    const hasCpu = hasOneOf('cpu_sample', 'cpu');

    // Deteta qualquer tipo de SSD SATA ou armazenamento secundário válido
    // Deteta se há NVMe instalado
    const hasNvme = hasOneOf('nvme_ssd', 'nvme');

    const visibleItems = [
      {
        id: 'ram',
        label: 'Expandir a memória RAM da máquina.',
        done: ramCount >= 2,
      },
      {
        id: 'nvme',
        label: 'Evitar SSD NVMe incompatível com a placa-mãe.',
        done: !hasNvme,
      },
      {
        id: 'ready',
        label: 'Garantir que a máquina esteja pronta para uso prático.',
        done: !hasNvme && ramCount >= 2,
      },
    ];

    const hiddenChecks = [
      {
        label: 'O gabinete precisa permanecer instalado.',
        done: hasCase || installedNames.some(n => n.includes('case')),
      },
      {
        label: 'A placa-mãe precisa permanecer instalada.',
        done:
          hasMotherboard ||
          installedNames.some(
            n => n.includes('motherboard') || n.includes('board'),
          ),
      },
      {
        label: 'O processador precisa permanecer instalado.',
        done:
          hasCpu ||
          installedNames.some(
            n => n.includes('cpu') || n.includes('processor'),
          ),
      },
      {
        label: 'O cooler precisa permanecer instalado.',
        done:
          hasCooler ||
          installedNames.some(
            n => n.includes('cooler') || n.includes('heatsink'),
          ),
      },
      {
        label: 'A fonte precisa permanecer instalada.',
        done:
          hasPowerSupply ||
          installedNames.some(
            n =>
              n.includes('power') ||
              n.includes('psu') ||
              n.includes('atx_power'),
          ),
      },
      {
        label: 'A máquina precisa manter ventilação básica.',
        done: fanCount >= 1 || installedNames.some(n => n.includes('fan')),
      },
    ];

    const solved = visibleItems.filter(item => item.done).length;
    const progress =
      visibleItems.length > 0 ? (solved / visibleItems.length) * 100 : 0;

    const canFinish =
      visibleItems.every(item => item.done) &&
      hiddenChecks.every(item => item.done);

    return {
      visibleItems,
      hiddenChecks,
      solved,
      progress,
      canFinish,
    };
  }, [baseModel, rerenderState]);

  const handleFinishMission = useCallback(() => {
    const pendingVisible = missionState.visibleItems.filter(item => !item.done);
    const pendingHidden = missionState.hiddenChecks.filter(item => !item.done);

    if (pendingVisible.length === 0) {
      window.alert('Parabéns! Você concluiu a missão com sucesso.');
      return;
    }

    setMissionAlertData({ pendingVisible, pendingHidden });
    setIsMissionAlertOpen(true);
  }, [missionState]);

  // Adiciona a peça automaticamente com 1 clique num slot vazio com base no nome
  // Adiciona a peça automaticamente com 1 clique, abrindo o painel se houver restrição de compatibilidade (como no SSD)
  const handleMountPointClick = useCallback(
    (mountPoint: MountPoint | 'root') => {
      if (mountPoint === 'root' || builder === undefined) {
        setSelectedTarget(prev => (prev === 'root' ? undefined : 'root'));
        return;
      }

      const slotName = mountPoint.name.toLowerCase();

      // Se for slot de armazenamento/SSD, abrimos o painel lateral para o aluno
      // escolher a peça compatível (SATA vs NVMe), respeitando as restrições da missão.
      if (
        slotName.includes('storage') ||
        slotName.includes('ssd') ||
        slotName.includes('drive')
      ) {
        setSelectedTarget(mountPoint);
        return;
      }

      let defaultUrl = 'res/120mm_fan_sample.glb';

      if (slotName.includes('ram')) {
        defaultUrl = 'res/ddr4_ram_sample.glb';
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

      (async () => {
        try {
          const model = await runtime.addModel(defaultUrl);
          if (model && mountPoint.attach(model)) {
            refreshMissionState();
          } else if (model) {
            model.dispose(true);
            // Se o encaixe direto falhar por compatibilidade, abre o painel para escolha manual
            setSelectedTarget(mountPoint);
          }
        } catch (error) {
          console.error('Erro ao adicionar componente automaticamente:', error);
          setSelectedTarget(mountPoint);
        }
      })();
    },
    [builder],
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
        const id = setInterval(() => {
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
        const extraFanModel = await runtime.addModel(
          'res/120mm_fan_sample.glb',
        );
        if (extraFanModel) {
          fanModels.push(extraFanModel);
        }
      }

      const [ramModel] = await Promise.all([
        runtime.addModel('res/ddr4_ram_sample.glb'),
        increaseTo(99),
      ]);

      const [cpuModel] = await Promise.all([
        runtime.addModel('res/cpu_sample.glb'),
        increaseTo(100),
      ]);

      await new Promise(resolve => setTimeout(resolve, 100));

      {
        let fanModelIndex = 0;
        const mountPoints = caseModel!.mountPoints;
        for (let i = 0; i < mountPoints.length; ++i) {
          const mountPoint = mountPoints[i];
          if (
            fanModels[fanModelIndex] &&
            mountPoint.attach(fanModels[fanModelIndex])
          ) {
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
        const mountPoints = motherBorardModel!.mountPoints;
        for (let i = 0; i < mountPoints.length; ++i) {
          const mountPoint = mountPoints[i];
          if (mountPoint.attach(ramModel!)) {
            await new Promise(resolve => setTimeout(resolve, 200));
            break;
          }
        }
      }

      setRerenderState(x => !x);
    })();
  }, [builder, isInitialized, onBaseModelChanged, setPrecent]);

  const isLoading = percent < 100;

  const forceMissionRefresh = useCallback(() => {
    refreshMissionState();
  }, []);

  return (
    <>
      {/* Botão para voltar à tela de resumo/orientações da missão */}
      {onBack && !isLoading && (
        <button
          onClick={onBack}
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 9998,
            padding: '10px 16px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(148, 163, 184, 0.28)',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
          }}
        >
          ◀ Voltar ao Resumo
        </button>
      )}

      {/* Botão flutuante para abrir o resumo do problema */}
      {!isLoading && (
        <button
          onClick={() => setIsProblemModalOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9998,
            padding: '12px 18px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
            color: '#ffffff',
            border: 'none',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)',
          }}
        >
          Ver Problema e Dicas 🔍
        </button>
      )}

      {/* Janela Pop-up (Modal) com o resumo e restrições */}
      {isProblemModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(2, 6, 23, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background:
                'linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(8, 15, 28, 0.98))',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
              color: '#e8eef8',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '20px', color: '#f8fbff' }}>
                Resumo do Problema e Orientações
              </h2>
              <button
                onClick={() => setIsProblemModalOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>
            </div>

            <p
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#d5e2f0',
                marginBottom: '20px',
              }}
            >
              Durante a aula prática, a turma recebeu um computador que liga,
              mas não atende adequadamente às atividades propostas. Analise a
              configuração atual e substitua as peças necessárias para tornar a
              máquina utilizável.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background: 'rgba(10, 18, 32, 0.8)',
                  padding: '16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 8px 0',
                    color: '#38bdf8',
                    fontSize: '15px',
                  }}
                >
                  Sintomas Observados
                </h4>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '18px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: '#bed0e3',
                  }}
                >
                  <li>Inicialização inadequada para uso prático imediato.</li>
                  <li>
                    Baixo desempenho em multitarefa devido à memória RAM
                    reduzida (apenas 4 GB).
                  </li>
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(10, 18, 32, 0.8)',
                  padding: '16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 8px 0',
                    color: '#38bdf8',
                    fontSize: '15px',
                  }}
                >
                  Restrições e Dicas Técnicas
                </h4>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '18px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: '#bed0e3',
                  }}
                >
                  <li>
                    <strong>Memória:</strong> É necessário expandir a RAM usando
                    módulos DDR4 compatíveis.
                  </li>
                  <li>
                    <strong>Armazenamento:</strong> Instale um SSD SATA
                    compatível.
                  </li>
                  <li>
                    <strong>Incompatibilidade:</strong> A placa-mãe{' '}
                    <strong>não possui slot M.2 NVMe</strong>, portanto evite
                    escolher esse tipo de SSD.
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setIsProblemModalOpen(false)}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '12px',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Retornar à montagem
            </button>
          </div>
        </div>
      )}

      {/* Overlay com o progresso dos problemas a solucionar */}
      {!isLoading && (
        <GlobalMissionOverlay>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
            Problemas a solucionar ({missionState.solved}/
            {missionState.visibleItems.length})
          </div>

          {missionState.visibleItems.map(item => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13,
                lineHeight: 1.5,
                opacity: item.done ? 1 : 0.72,
                color: item.done ? '#86efac' : '#e2e8f0',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  flex: '0 0 10px',
                  background: item.done ? '#22c55e' : '#475569',
                }}
              />
              <span>{item.label}</span>
            </div>
          ))}

          <div
            style={{
              width: '100%',
              height: 10,
              marginTop: 12,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${missionState.progress}%`,
                borderRadius: 999,
                background: 'linear-gradient(90deg, #38bdf8, #22c55e)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          <button
            onClick={handleFinishMission}
            style={{
              marginTop: 16,
              width: '100%',
              height: 42,
              border: 'none',
              borderRadius: 12,
              background: '#2563eb',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Finalizar missão
          </button>
        </GlobalMissionOverlay>
      )}

      {/* Modal Estilizado de Aviso de Missão Incompleta */}
      {isMissionAlertOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10001,
            background: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background:
                'linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(8, 15, 28, 0.98))',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
              color: '#e8eef8',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                ⚠️
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>
                  A missão ainda não pode ser finalizada
                </h3>
                <p
                  style={{
                    margin: '2px 0 0 0',
                    fontSize: '13px',
                    color: '#94a3b8',
                  }}
                >
                  Verifique os itens pendentes abaixo para continuar:
                </p>
              </div>
            </div>

            {missionAlertData.pendingVisible.length > 0 && (
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '14px',
                  borderRadius: '14px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 8px 0',
                    color: '#38bdf8',
                    fontSize: '14px',
                  }}
                >
                  Critérios do Problema:
                </h4>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '18px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: '#cbd5e1',
                  }}
                >
                  {missionAlertData.pendingVisible.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {missionAlertData.pendingHidden.length > 0 && (
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '14px',
                  borderRadius: '14px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 8px 0',
                    color: '#fca5a5',
                    fontSize: '14px',
                  }}
                >
                  Integridade da Máquina:
                </h4>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '18px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: '#cbd5e1',
                  }}
                >
                  {missionAlertData.pendingHidden.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setIsMissionAlertOpen(false)}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)',
              }}
            >
              Entendido, continuar montagem
            </button>
          </div>
        </div>
      )}

      <PCCProblemMissionRootDiv>
        {baseModel ? (
          <TreeViewRerenderContext.Provider value={forceMissionRefresh}>
            <PCCRuntimeContext.Provider value={builder?.runtime}>
              <PcComponentsListDiv>
                <TreePCCView
                  model={baseModel}
                  onClickEmptyMountPoint={handleMountPointClick}
                />
              </PcComponentsListDiv>
            </PCCRuntimeContext.Provider>
          </TreeViewRerenderContext.Provider>
        ) : null}

        <LoadingScreen isShowing={isLoading} />
      </PCCProblemMissionRootDiv>
    </>
  );
}
