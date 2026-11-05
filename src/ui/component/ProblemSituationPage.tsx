import styled from 'styled-components';
import { VyxorModule } from './HomePage';

const Screen = styled.main`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  background: radial-gradient(
      circle at top left,
      rgba(14, 165, 233, 0.18),
      transparent 30%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(59, 130, 246, 0.14),
      transparent 26%
    ),
    linear-gradient(180deg, #10192b 0%, #0b1220 42%, #060b16 100%);
  color: #e8eef8;
`;

const Header = styled.header`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 40px 0 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media screen and (max-width: 768px) {
    padding: 18px 16px 0 16px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #f8fbff;
`;

const BackButton = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #eef6ff;
  padding: 12px 18px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  backdrop-filter: blur(10px);
  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(125, 211, 252, 0.42);
  }
`;

const Hero = styled.section`
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
  padding: 32px 20px 40px;
  box-sizing: border-box;
`;

const MainCard = styled.div`
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.88),
    rgba(8, 15, 28, 0.96)
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);

  @media screen and (max-width: 768px) {
    padding: 22px;
    border-radius: 20px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 24px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h1`
  margin: 18px 0 12px 0;
  font-size: clamp(32px, 4.8vw, 64px);
  line-height: 1.02;
  letter-spacing: -0.04em;
  color: #f8fbff;
`;

const Lead = styled.p`
  margin: 0;
  max-width: 62ch;
  color: #d5e2f0;
  font-size: clamp(16px, 1.9vw, 20px);
  line-height: 1.65;
`;

const Panel = styled.div`
  background: rgba(10, 18, 32, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 24px;
`;

const PanelTitle = styled.h3`
  margin: 0 0 14px 0;
  font-size: 20px;
  color: #ffffff;
`;

const BulletList = styled.div`
  margin-top: 18px;
  display: grid;
  gap: 12px;
`;

const Bullet = styled.div`
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 12px;
  align-items: start;
`;

const BulletIndex = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #38bdf8, #2563eb);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
`;

const BulletBody = styled.div`
  h4 {
    margin: 0 0 4px 0;
    font-size: 15px;
    color: #f8fbff;
  }

  p {
    margin: 0;
    color: #bed0e3;
    font-size: 13px;
    line-height: 1.6;
  }
`;

const ActionRow = styled.div`
  margin-top: 28px;
  display: flex;
  justify-content: center;
`;

const StartButton = styled.button`
  border: none;
  background: linear-gradient(135deg, #38bdf8, #2563eb);
  color: #f8fbff;
  padding: 14px 22px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.03em;
  box-shadow: 0 14px 34px rgba(37, 99, 235, 0.28);
  transition:
    transform 0.15s ease,
    filter 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }
`;

export interface ProblemSituationPageProps {
  onStart: (module: VyxorModule) => void;
  onBack?: () => void;
}

export function ProblemSituationPage({
  onStart,
  onBack,
}: ProblemSituationPageProps) {
  return (
    <Screen>
      <Header>
        <Brand>
          <img
            src="res/logo.png"
            alt="Logo do Vyxor Lab"
            style={{ height: 40, width: 'auto', display: 'block' }}
          />
        </Brand>

        {onBack ? <BackButton onClick={onBack}>Voltar</BackButton> : null}
      </Header>

      <Hero>
        <MainCard>
          <Title>Computador incompleto no laboratório</Title>

          <Lead>
            Durante a aula prática, a turma recebeu um computador que liga, mas
            não atende adequadamente às atividades propostas. O aluno deve
            analisar a configuração atual, identificar quais componentes estão
            precisam ser substituídos e escolher peças compatíveis para tornar a
            máquina utilizável no laboratório.
          </Lead>

          <InfoGrid>
            <Panel>
              <PanelTitle>Sintomas observados</PanelTitle>
              <BulletList>
                <Bullet>
                  <BulletIndex>1</BulletIndex>
                  <BulletBody>
                    <h4>Inicialização inadequada</h4>
                    <p>
                      O computador não está pronto para uso prático logo ao
                      iniciar.
                    </p>
                  </BulletBody>
                </Bullet>

                <Bullet>
                  <BulletIndex>2</BulletIndex>
                  <BulletBody>
                    <h4>Baixo desempenho em multitarefa</h4>
                    <p>
                      Com apenas 4 GB de RAM, o sistema perde desempenho ao
                      abrir vários programas.
                    </p>
                  </BulletBody>
                </Bullet>

                <Bullet>
                  <BulletIndex>3</BulletIndex>
                  <BulletBody>
                    <h4>Análise de componentes</h4>
                    <p>
                      Algumas peças precisam ser verificadas, adicionadas ou
                      substituídas para que a máquina funcione corretamente.
                    </p>
                  </BulletBody>
                </Bullet>
              </BulletList>
            </Panel>

            <Panel>
              <PanelTitle>Restrições do computador</PanelTitle>
              <BulletList>
                <Bullet>
                  <BulletIndex>A</BulletIndex>
                  <BulletBody>
                    <h4>Memória atual</h4>
                    <p>A máquina possui apenas 4 GB de RAM DDR4.</p>
                  </BulletBody>
                </Bullet>

                <Bullet>
                  <BulletIndex>B</BulletIndex>
                  <BulletBody>
                    <h4>Compatibilidade da placa-mãe</h4>
                    <p>A placa aceita peças SATA e memória DDR4.</p>
                  </BulletBody>
                </Bullet>

                <Bullet>
                  <BulletIndex>C</BulletIndex>
                  <BulletBody>
                    <h4>Limitação técnica</h4>
                    <p>
                      A placa-mãe não possui slot M.2 NVMe, então esse tipo de
                      SSD não deve ser escolhido.
                    </p>
                  </BulletBody>
                </Bullet>
              </BulletList>
            </Panel>
          </InfoGrid>

          <ActionRow>
            <StartButton onClick={() => onStart('livre')}>
              Iniciar diagnóstico
            </StartButton>
          </ActionRow>
        </MainCard>
      </Hero>
    </Screen>
  );
}

export default ProblemSituationPage;
