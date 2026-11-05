import styled, { keyframes } from 'styled-components';

// --- Animações ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(56, 189, 248, 0.2); }
  50% { box-shadow: 0 0 20px rgba(56, 189, 248, 0.4); }
  100% { box-shadow: 0 0 5px rgba(56, 189, 248, 0.2); }
`;

// --- Componentes Estilizados ---
const HomeWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(
      circle at 50% -20%,
      rgba(56, 189, 248, 0.15),
      transparent 45%
    ),
    linear-gradient(180deg, #0f172a 0%, #020617 100%);
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;

  /* Malha de fundo técnica */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      ),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }
`;

const TopBar = styled.header`
  padding: 30px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -1px;
  color: #f8fafc;
  span {
    color: #38bdf8;
  }
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px 60px 40px;
  width: 100%;
  box-sizing: border-box;
  animation: ${fadeIn} 0.8s ease-out;
`;

const HeroSection = styled.section`
  text-align: center;
  margin: 40px 0 80px 0;

  h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    margin: 0;
    background: linear-gradient(to bottom, #fff, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
  }

  p {
    font-size: 1.2rem;
    color: #94a3b8;
    max-width: 600px;
    margin: 20px auto;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
`;

const ModuleCard = styled.div<{ $primary?: boolean }>`
  background: ${props =>
    props.$primary ? 'rgba(56, 189, 248, 0.05)' : 'rgba(30, 41, 59, 0.4)'};
  border: 1px solid
    ${props =>
      props.$primary ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.08)'};
  backdrop-filter: blur(12px);
  padding: 32px;
  border-radius: 20px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    border-color: #38bdf8;
    background: rgba(56, 189, 248, 0.08);
  }
`;

const StartButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: #38bdf8;
  color: #0f172a;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: 0.2s;
  animation: ${glow} 3s infinite;

  &:hover {
    background: #7dd3fc;
    transform: scale(1.02);
  }
`;

const BenchmarkSection = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 40px;
`;

const BenchBar = styled.div<{ $w: number; $color?: string }>`
  height: 12px;
  background: #1e293b;
  border-radius: 6px;
  width: 100%;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: ${props => props.$w}%;
    background: ${props =>
      props.$color || 'linear-gradient(90deg, #38bdf8, #818cf8)'};
    border-radius: 6px;
    transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

const BenchLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #94a3b8;
  span:last-child {
    color: #f1f5f9;
    font-weight: 600;
  }
`;

// --- Tipos ---
export type VyxorModule = 'livre' | 'memoria' | 'armazenamento';

interface HomePageProps {
  onStartDirect: (module: VyxorModule) => void;
  onStartProblem: (module: VyxorModule) => void;
}

export function HomePage({ onStartDirect, onStartProblem }: HomePageProps) {
  return (
    <HomeWrapper>
      <TopBar>
        <Brand>
          <img
            src="res/logo.png"
            alt="Logo do Vyxor Lab"
            style={{ height: 40, width: 'auto', display: 'block' }}
          />
        </Brand>
        <div style={{ color: '#94a3b8', fontSize: '14px' }}>v2.0 Beta</div>
      </TopBar>

      <MainContent>
        <HeroSection>
          <h1>Hardware sob controle.</h1>
          <p>
            Experimente, falhe e aprenda a arquitetura de computadores em um
            ambiente digital de alta fidelidade.
          </p>
        </HeroSection>

        <ActionGrid>
          <ModuleCard $primary onClick={() => onStartProblem('armazenamento')}>
            <h3 style={{ color: '#38bdf8', marginTop: 0 }}>
              Módulo Diagnóstico
            </h3>
            <p>
              Um PC lento chegou na oficina. Identifique o gargalo (SATA vs
              NVMe) e resolva o problema do cliente.
            </p>
            <StartButton>Resolver Problema</StartButton>
          </ModuleCard>

          <ModuleCard onClick={() => onStartDirect('livre')}>
            <h3 style={{ marginTop: 0 }}>Laboratório Livre</h3>
            <p>
              Monte o setup dos seus sonhos sem restrições de orçamento,
              explorando compatibilidade de soquetes e barramentos.
            </p>
            <button
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #334155',
                background: 'transparent',
                color: '#f1f5f9',
                cursor: 'pointer',
                marginTop: '20px',
              }}
            >
              Explorar Sandbox
            </button>
          </ModuleCard>
        </ActionGrid>

        <BenchmarkSection>
          <h3 style={{ marginBottom: '30px' }}>
            Simulação de Performance (OAC)
          </h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <BenchLabel>
                <span>HD Mecânico (Latência Alta)</span>
                <span>35% Perf.</span>
              </BenchLabel>
              <BenchBar $w={35} $color="#ef4444" />
            </div>
            <div>
              <BenchLabel>
                <span>SSD SATA III (Limite de Barramento)</span>
                <span>65% Perf.</span>
              </BenchLabel>
              <BenchBar $w={65} $color="#f59e0b" />
            </div>
            <div>
              <BenchLabel>
                <span>M.2 NVMe (PCIe Gen4)</span>
                <span>95% Perf.</span>
              </BenchLabel>
              <BenchBar $w={95} $color="#22c55e" />
            </div>
          </div>
        </BenchmarkSection>
      </MainContent>
    </HomeWrapper>
  );
}
