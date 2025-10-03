// Утилиты для проверки состояния генерации

export interface GenerationStateProps {
  isLoading: boolean;
  showContractType: boolean;
  showContractSelect: boolean;
  showEntitiesForm: boolean;
  showFinalResult: boolean;
}

// Проверяет, активен ли какой-либо шаг генерации
export const isAnyStepActive = (state: GenerationStateProps): boolean => {
  return state.isLoading || state.showContractType || state.showContractSelect ||
         state.showEntitiesForm || state.showFinalResult;
};

// Проверяет, находится ли генерация в состоянии ожидания (idle)
export const isIdleState = (state: GenerationStateProps): boolean => {
  return !state.isLoading && !state.showContractType && !state.showContractSelect &&
         !state.showEntitiesForm && !state.showFinalResult;
};

// Проверяет, должен ли показываться overlay
export const shouldShowOverlay = (showOverlay: boolean, state: GenerationStateProps): boolean => {
  return showOverlay && isIdleState(state);
};

// Проверяет, находится ли компонент в фокусированном состоянии
export const isFocusedState = (state: GenerationStateProps): boolean => {
  return state.isLoading || state.showContractType || state.showContractSelect ||
         state.showEntitiesForm || state.showFinalResult;
};