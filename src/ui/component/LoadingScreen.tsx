import styled from 'styled-components';
import { JSX, useState, useEffect } from 'react';

interface LoadingScreenDivProps {
  $opacity: number;
  $pointerEvents: string;
}

const LoadingScreenDiv = styled.div<LoadingScreenDivProps>`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background-color: #0f172a;
  backdrop-filter: blur(5px);

  transition: opacity 0.2s;
  opacity: ${props => props.$opacity};
  pointer-events: ${props => props.$pointerEvents};
`;

const LoadingScreenSpinnerDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;

  width: 50px;
  height: 50px;

  border: 5px solid #1e293b;
  border-top: 5px solid #3b82f6;
  border-radius: 50%;

  box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);

  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

interface LoadingScreenProps {
  isShowing: boolean;
}

export function LoadingScreen(props: LoadingScreenProps): JSX.Element {
  const { isShowing: targetState } = props;

  const [lastTargetState, setLastTargetState] = useState<boolean>();

  useEffect(() => {
    if (targetState !== lastTargetState) {
      setLastTargetState(targetState);
    }
  }, [targetState]);

  const [isAnimating, setIsAnimating] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number>();

  useEffect(() => {
    setIsAnimating(true);
    window.clearTimeout(timeoutId);
    setTimeoutId(
      window.setTimeout(() => {
        setIsAnimating(false);
      }, 300),
    );
  }, [lastTargetState]);

  if (!targetState && !isAnimating) {
    return <LoadingScreenDiv $opacity={0} $pointerEvents="none" />;
  }

  return (
    <LoadingScreenDiv $opacity={targetState ? 1 : 0} $pointerEvents={'auto'}>
      <LoadingScreenSpinnerDiv />
    </LoadingScreenDiv>
  );
}
