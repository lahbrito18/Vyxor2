import styled from 'styled-components';
import { JSX, useMemo, useState } from 'react';

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(
      circle at top left,
      rgba(56, 189, 248, 0.12),
      transparent 30%
    ),
    linear-gradient(180deg, #08111f 0%, #0b1220 45%, #030712 100%);
  color: #e5eef7;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  width: 100%;
  padding: 18px 28px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  @media screen and (max-width: 768px) {
    padding: 16px;
    flex-direction: column;
    align-items: stretch;
  }
`;

const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.14);
  color: #fecaca;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.05;
  color: #f8fbff;
`;

const Subtitle = styled.p`
  margin: 0;
  max-width: 780px;
  color: #c8d7e6;
  font-size: 15px;
  line-height: 1.65;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const GhostButton = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: #e8f1fb;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

const PrimaryButton = styled.button`
  border: none;
  background: linear-gradient(135deg, #38bdf8, #2563eb);
  color: #ffffff;
  border-radius: 14px;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.28);
`;

const Main = styled.main`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 28px 32px 28px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 22px;

  @media screen and (max-width: 980px) {
    grid-template-columns: 1fr;
    padding: 16px;
  }
`;

const LeftColumn = styled.section`
  display: grid;
  gap: 18px;
`;

const RightColumn = styled.aside`
  display: grid;
  gap: 18px;
`;

const Card = styled.div`
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(10px);
  padding: 20px;
`;

const CardTitle = styled.h2`
  margin: 0 0 14px 0;
  font-size: 20px;
  color: #f8fbff;
`;

const CardText = styled.p`
  margin: 0;
  color: #d4e1ef;
  font-size: 14px;
  line-height: 1.65;
`;

const ScenarioGrid = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ScenarioBox = styled.div`
  border-radius: 16px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const ScenarioLabel = styled.div`
  color: #93c5fd;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const ScenarioValue = styled.div`
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.35;
`;

const GoalsList = styled.div`
  display: grid;
  gap: 10px;
`;

const GoalItem = styled.div<{ $done?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border-radius: 14px;
  padding: 12px 14px;
  background: ${props =>
    props.$done ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)'};
  border: 1px solid
    ${props =>
      props.$done ? 'rgba(52, 211, 153, 0.28)' : 'rgba(255, 255, 255, 0.08)'};
`;

const GoalDot = styled.div<{ $done?: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  margin-top: 5px;
  flex: 0 0 10px;
  background: ${props => (props.$done ? '#34d399' : '#60a5fa')};
`;

const GoalText = styled.div`
  color: #dbe7f3;
  font-size: 13px;
  line-height: 1.55;
`;

const InventoryGrid = styled.div`
  display: grid;
  gap: 10px;
`;

const InventoryButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  text-align: left;
  border-radius: 16px;
  padding: 14px 14px;
  cursor: pointer;
  border: 1px solid
    ${props =>
      props.$active ? 'rgba(96, 165, 250, 0.5)' : 'rgba(255, 255, 255, 0.08)'};
  background: ${props =>
    props.$active ? 'rgba(37, 99, 235, 0.16)' : 'rgba(255, 255, 255, 0.04)'};
  color: #f8fbff;
`;

const ItemName = styled.div`
  font-size: 14px;
  font-weight: 800;
`;

const ItemMeta = styled.div`
  margin-top: 6px;
  color: #bfd1e3;
  font-size: 12px;
  line-height: 1.5;
`;

const FeedbackBox = styled.div<{ $type: 'info' | 'success' | 'warning' }>`
  border-radius: 18px;
  padding: 16px;
  font-size: 13px;
  line-height: 1.6;
  border: 1px solid
    ${props =>
      props.$type === 'success'
        ? 'rgba(52, 211, 153, 0.28)'
        : props.$type === 'warning'
          ? 'rgba(251, 191, 36, 0.28)'
          : 'rgba(96, 165, 250, 0.24)'};
  background: ${props =>
    props.$type === 'success'
      ? 'rgba(16, 185, 129, 0.12)'
      : props.$type === 'warning'
        ? 'rgba(245, 158, 11, 0.12)'
        : 'rgba(37, 99, 235, 0.12)'};
  color: ${props =>
    props.$type === 'success'
      ? '#d1fae5'
      : props.$type === 'warning'
        ? '#fde68a'
        : '#dbeafe'};
`;

const BenchmarkPanel = styled.div`
  display: grid;
  gap: 12px;
`;

const BenchRow = styled.div`
  display: grid;
  gap: 6px;
`;

const BenchTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #d6e4f2;
  font-size: 13px;
`;

const BenchTrack = styled.div`
  height: 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
`;

const BenchFill = styled.div<{ $width: number; $tone?: 'base' | 'upgrade' }>`
  height: 100%;
  width: ${props => props.$width}%;
  border-radius: 999px;
  background: ${props =>
    props.$tone === 'upgrade'
      ? 'linear-gradient(90deg, #34d399, #10b981)'
      : 'linear-gradient(90deg, #64748b, #94a3b8)'};
`;

interface ProblemSolvingLabProps {
  onBack: () => void;
  onExit: () => void;
}

type UpgradeOption = 'ssd-sata' | 'ssd-nvme' | 'ram-8gb' | 'cpu';

export default function ProblemSolvingLab({
  onBack,
  onExit,
}: ProblemSolvingLabProps): JSX.Element {
  const [selectedOption, setSelectedOption] =
    useState<UpgradeOption>('ssd-sata');
  const [tested, setTested] = useState(false);

  const feedback = useMemo(() => {
    if (selectedOption === 'ssd-nvme') {
      return {
        type: 'warning' as const,
        text: 'SSD M.2 NVMe parece uma escolha rápida, mas esta missão parte de uma placa sem suporte adequado ao barramento necessário. O upgrade não deve ser aceito como solução correta.',
      };
    }

    if (selectedOption === 'ram-8gb') {
      return {
        type: 'success' as const,
        text: 'Aumentar a RAM ajuda na multitarefa e reduz trocas frequentes com armazenamento, mas ainda pode não resolver sozinho o boot lento se o disco principal continuar muito lento.',
      };
    }

    if (selectedOption === 'cpu') {
      return {
        type: 'info' as const,
        text: 'Trocar a CPU pode melhorar processamento, mas os sintomas descritos apontam primeiro para armazenamento lento e pouca RAM como gargalos mais evidentes.',
      };
    }

    return {
      type: 'success' as const,
      text: 'Boa escolha. Um SSD SATA é compatível com a proposta da missão e melhora bastante o tempo de inicialização e a resposta geral do sistema.',
    };
  }, [selectedOption]);

  const result = useMemo(() => {
    if (!tested) {
      return null;
    }

    if (selectedOption === 'ssd-nvme') {
      return {
        bootBefore: 100,
        bootAfter: 100,
        loadBefore: 100,
        loadAfter: 100,
        summary:
          'Teste inválido: a solução escolhida não respeita a compatibilidade do barramento da placa-mãe.',
      };
    }

    if (selectedOption === 'ram-8gb') {
      return {
        bootBefore: 100,
        bootAfter: 82,
        loadBefore: 100,
        loadAfter: 68,
        summary:
          'Melhora parcial: a máquina responde melhor em multitarefa, mas o armazenamento ainda limita bastante o boot.',
      };
    }

    if (selectedOption === 'cpu') {
      return {
        bootBefore: 100,
        bootAfter: 92,
        loadBefore: 100,
        loadAfter: 84,
        summary:
          'Ganho pequeno para o problema principal: o processador não era o maior gargalo deste cenário.',
      };
    }

    return {
      bootBefore: 100,
      bootAfter: 38,
      loadBefore: 100,
      loadAfter: 52,
      summary:
        'Solução consistente: o sistema inicializa muito mais rápido e fica mais responsivo sem quebrar as regras de compatibilidade propostas pela missão.',
    };
  }, [selectedOption, tested]);

  const goalState = {
    storage: selectedOption === 'ssd-sata',
    ram: selectedOption === 'ram-8gb' || selectedOption === 'ssd-sata',
    compatibility: selectedOption !== 'ssd-nvme',
  };

  return (
    <Page>
      <Header>
        <BrandBlock>
          <Badge>Situação-problema</Badge>
          <Title>Computador lento no laboratório</Title>
          <Subtitle>
            Analise os sintomas, escolha um upgrade coerente e teste a solução
            com base em desempenho, compatibilidade e gargalos do sistema.
          </Subtitle>
        </BrandBlock>

        <HeaderActions>
          <GhostButton onClick={onBack}>Voltar ao caso</GhostButton>
          <GhostButton onClick={onExit}>Sair para início</GhostButton>
          <PrimaryButton onClick={() => setTested(true)}>
            Testar solução
          </PrimaryButton>
        </HeaderActions>
      </Header>

      <Main>
        <LeftColumn>
          <Card>
            <CardTitle>Cenário inicial</CardTitle>
            <CardText>
              O computador do laboratório demora para iniciar, sofre em
              multitarefa e apresenta resposta baixa ao abrir programas. A meta
              é melhorar a máquina sem violar compatibilidade de barramento nem
              escolher uma peça desproporcional ao gargalo principal.
            </CardText>

            <ScenarioGrid>
              <ScenarioBox>
                <ScenarioLabel>Armazenamento atual</ScenarioLabel>
                <ScenarioValue>
                  HD mecânico com alto tempo de acesso
                </ScenarioValue>
              </ScenarioBox>

              <ScenarioBox>
                <ScenarioLabel>Memória atual</ScenarioLabel>
                <ScenarioValue>
                  4 GB de RAM com limitação em multitarefa
                </ScenarioValue>
              </ScenarioBox>

              <ScenarioBox>
                <ScenarioLabel>Restrição técnica</ScenarioLabel>
                <ScenarioValue>
                  Sem suporte adequado para SSD NVMe nesta missão
                </ScenarioValue>
              </ScenarioBox>
            </ScenarioGrid>
          </Card>

          <Card>
            <CardTitle>Benchmark didático</CardTitle>
            <CardText>
              O teste compara uma referência anterior com a solução escolhida
              para reforçar a interpretação do gargalo predominante.
            </CardText>

            <BenchmarkPanel style={{ marginTop: 16 }}>
              <BenchRow>
                <BenchTop>
                  <span>Tempo de boot</span>
                  <span>{result ? result.summary : 'Aguardando teste'}</span>
                </BenchTop>
                <BenchTrack>
                  <BenchFill $width={100} />
                </BenchTrack>
                {result ? (
                  <BenchTrack>
                    <BenchFill $width={result.bootAfter} $tone="upgrade" />
                  </BenchTrack>
                ) : null}
              </BenchRow>

              <BenchRow>
                <BenchTop>
                  <span>Resposta em carregamento</span>
                  <span>
                    {tested ? 'Depois da troca aplicada' : 'Sem medição ainda'}
                  </span>
                </BenchTop>
                <BenchTrack>
                  <BenchFill $width={100} />
                </BenchTrack>
                {result ? (
                  <BenchTrack>
                    <BenchFill $width={result.loadAfter} $tone="upgrade" />
                  </BenchTrack>
                ) : null}
              </BenchRow>
            </BenchmarkPanel>
          </Card>
        </LeftColumn>

        <RightColumn>
          <Card>
            <CardTitle>Objetivos da missão</CardTitle>
            <GoalsList>
              <GoalItem $done={goalState.storage}>
                <GoalDot $done={goalState.storage} />
                <GoalText>
                  Identificar se o armazenamento é o principal responsável pelo
                  boot lento.
                </GoalText>
              </GoalItem>

              <GoalItem $done={goalState.ram}>
                <GoalDot $done={goalState.ram} />
                <GoalText>
                  Avaliar se a RAM também contribui para travamentos e baixa
                  resposta em multitarefa.
                </GoalText>
              </GoalItem>

              <GoalItem $done={goalState.compatibility}>
                <GoalDot $done={goalState.compatibility} />
                <GoalText>
                  Evitar upgrades incompatíveis, especialmente em barramentos e
                  slots.
                </GoalText>
              </GoalItem>
            </GoalsList>
          </Card>

          <Card>
            <CardTitle>Inventário de peças</CardTitle>
            <InventoryGrid>
              <InventoryButton
                $active={selectedOption === 'ssd-sata'}
                onClick={() => {
                  setSelectedOption('ssd-sata');
                  setTested(false);
                }}
              >
                <ItemName>SSD SATA 240GB</ItemName>
                <ItemMeta>
                  Upgrade compatível com foco em boot mais rápido e melhor
                  resposta geral.
                </ItemMeta>
              </InventoryButton>

              <InventoryButton
                $active={selectedOption === 'ssd-nvme'}
                onClick={() => {
                  setSelectedOption('ssd-nvme');
                  setTested(false);
                }}
              >
                <ItemName>SSD M.2 NVMe 1TB</ItemName>
                <ItemMeta>
                  Muito rápido, mas depende de slot e barramento compatíveis na
                  placa-mãe.
                </ItemMeta>
              </InventoryButton>

              <InventoryButton
                $active={selectedOption === 'ram-8gb'}
                onClick={() => {
                  setSelectedOption('ram-8gb');
                  setTested(false);
                }}
              >
                <ItemName>RAM 8GB DDR4</ItemName>
                <ItemMeta>
                  Ajuda na multitarefa e reduz o impacto de pouca memória.
                </ItemMeta>
              </InventoryButton>

              <InventoryButton
                $active={selectedOption === 'cpu'}
                onClick={() => {
                  setSelectedOption('cpu');
                  setTested(false);
                }}
              >
                <ItemName>CPU de geração superior</ItemName>
                <ItemMeta>
                  Pode melhorar processamento, mas nem sempre resolve o gargalo
                  principal.
                </ItemMeta>
              </InventoryButton>
            </InventoryGrid>
          </Card>

          <Card>
            <CardTitle>Feedback técnico</CardTitle>
            <FeedbackBox $type={feedback.type}>{feedback.text}</FeedbackBox>
            {result ? (
              <FeedbackBox
                $type={selectedOption === 'ssd-nvme' ? 'warning' : 'success'}
                style={{ marginTop: 12 }}
              >
                {result.summary}
              </FeedbackBox>
            ) : null}
          </Card>
        </RightColumn>
      </Main>
    </Page>
  );
}
