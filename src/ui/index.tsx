import ReactDOM from 'react-dom/client';
import {
  JSX,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { Line } from 'rc-progress';
import { CanvasContextProvider } from './context/CanvasContext';
import PCCUIRoot from './component/PCCUIRoot';
import PCCProblemMissionRoot from './component/PCCProblemMissionRoot';
import { HomePage, VyxorModule } from './component/HomePage';
import ProblemSituationPage from './component/ProblemSituationPage';

await new Promise(resolve => {
  if (document.readyState === 'complete') {
    resolve(undefined);
    return;
  }

  window.onload = () => resolve(undefined);
});

export const verticalUiSize = 'min(120mm, 45%)';
export const horizontalUiSize = 'min(100mm, 35%)';

const AppRootDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  font-family: 'Arial', sans-serif;

  @media screen and (orientation: portrait) {
    flex-direction: column;
  }
`;

const RenderCanvas = styled.canvas`
  display: block;
  outline: none;
  flex: 1;
  min-width: 0;
  min-height: 0;

  @media screen and (orientation: portrait) {
    width: 100%;
    height: calc(100% - ${() => verticalUiSize});
  }

  @media screen and (orientation: landscape) {
    width: calc(100% - ${() => horizontalUiSize});
    height: 100%;
  }
`;

function LoadingOverlay({ percent }: { percent: number }): JSX.Element {
  return (
    <div
      style={{
        display: percent < 100 ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        inset: 0,
        backgroundColor: 'black',
        opacity: 0.6,
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: '50%',
          maxWidth: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Line percent={percent} strokeWidth={8} trailWidth={8} />
        <span
          style={{
            position: 'absolute',
            alignSelf: 'center',
            userSelect: 'none',
            opacity: 0.5,
            color: 'white',
          }}
        >
          loading...
        </span>
      </div>
    </div>
  );
}

function SimulatorView(props: {
  percent: number;
  setPercent: Dispatch<SetStateAction<number>>;
}): JSX.Element {
  const { percent, setPercent } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    setCanvas(canvasRef.current);
  }, []);

  return (
    <AppRootDiv>
      <LoadingOverlay percent={percent} />

      {canvas && (
        <CanvasContextProvider canvas={canvas}>
          <PCCUIRoot percent={percent} setPrecent={setPercent} />
        </CanvasContextProvider>
      )}

      <RenderCanvas ref={canvasRef} tabIndex={0} />
    </AppRootDiv>
  );
}

function ProblemLabView(props: {
  percent: number;
  setPercent: Dispatch<SetStateAction<number>>;
}): JSX.Element {
  const { percent, setPercent } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    setCanvas(canvasRef.current);
  }, []);

  return (
    <AppRootDiv>
      <LoadingOverlay percent={percent} />

      {canvas && (
        <CanvasContextProvider canvas={canvas}>
          <PCCProblemMissionRoot percent={percent} setPrecent={setPercent} />
        </CanvasContextProvider>
      )}

      <RenderCanvas ref={canvasRef} tabIndex={0} />
    </AppRootDiv>
  );
}

function Root(): JSX.Element {
  const [screen, setScreen] = useState<
    'home' | 'problem' | 'problem-lab' | 'lab'
  >('home');
  const [percent, setPercent] = useState(0);
  const [, setCurrentModule] = useState<VyxorModule | null>(null);

  function handleStartDirect(module: VyxorModule) {
    setCurrentModule(module);
    setPercent(0);
    setScreen('lab');
  }

  function handleStartProblem(module: VyxorModule) {
    setCurrentModule(module);
    setPercent(0);
    setScreen('problem');
  }

  function handleContinueToProblemLab() {
    setPercent(0);
    setScreen('problem-lab');
  }

  if (screen === 'home') {
    return (
      <AppRootDiv>
        <HomePage
          onStartDirect={handleStartDirect}
          onStartProblem={handleStartProblem}
        />
      </AppRootDiv>
    );
  }

  if (screen === 'problem') {
    return (
      <ProblemSituationPage
        onStart={handleContinueToProblemLab}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'problem-lab') {
    return <ProblemLabView percent={percent} setPercent={setPercent} />;
  }

  return <SimulatorView percent={percent} setPercent={setPercent} />;
}

const rootDiv = document.createElement('div');
rootDiv.style.width = '100%';
rootDiv.style.height = '100%';
rootDiv.style.margin = '0';
rootDiv.style.padding = '0';
document.body.appendChild(rootDiv);

const reactRoot = ReactDOM.createRoot(rootDiv);
reactRoot.render(<Root />);
