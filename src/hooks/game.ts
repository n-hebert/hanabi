import { useRouter } from "next/router";
import React, { useContext } from "react";

import { getStateAtTurn, isReplayMode } from "~/game/actions";
import IGameState, {
  fillEmptyValues,
  GameMode,
  IGameStatus
} from "~/game/state";
import useLocalStorage from "~/hooks/localStorage";

export const GameContext = React.createContext(null);

export function useGame() {
  const game = useContext<IGameState>(GameContext);

  if (isReplayMode(game)) {
    return {
      ...fillEmptyValues(getStateAtTurn(game, game.replayCursor)),
      originalGame: game,
      status: IGameStatus.OVER,
      replayCursor: game.replayCursor
    };
  }

  return game;
}

export function useCurrentPlayer(game: IGameState = useGame()) {
  if (!game) {
    return null;
  }

  return game.players[game.currentPlayer];
}

export function useSelfPlayer(game: IGameState = useGame()) {
  const router = useRouter();
  const currentPlayer = useCurrentPlayer(game);

  const [storedPlayerId] = useLocalStorage("playerId", null);

  // Allows overwriting the playerId using the page URL for backwards compatibility
  const playerId = router.query.playerId || storedPlayerId;
  if (!game) {
    return null;
  }

  if (game.options.gameMode === GameMode.NETWORK) {
    return game.players.find(p => p.id === playerId);
  }

  if (game.options.gameMode === GameMode.PASS_AND_PLAY) {
    return currentPlayer;
  }
}
