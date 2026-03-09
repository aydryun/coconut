import { NextResponse } from "next/server";
import {
  createMatch,
  relateRecordedUserToMatch,
} from "@/app/backend/surreal-actions";
import type { Match } from "@/types/match";
import type { SurrealResponse } from "@/types/surreal-response";

// Simulation d'une base de données

/**
 * Creer un match dans la base de données
 * @param matchData
 * @returns
 */
export async function POST(request: Request) {
  try {
    const requestData = await request.json();

    //Validation basique
    if (!requestData.owner_id) {
      return NextResponse.json(
        { error: "Un match doit avoir un Proprietaire" },
        { status: 400 },
      );
    }

    const createdAt = requestData.created_at
      ? new Date(requestData.created_at)
      : new Date();

    const newMatch: Match = {
      completed_at: new Date(),
      created_at: createdAt,
      players: requestData.players, // IDs des utilisateurs
      status: "completed",
      round_max: requestData.round_max,
    };

    if (requestData.winner) {
      newMatch.winner = requestData.winner;
    }

    const matchCreationData: SurrealResponse<any> = await createMatch(newMatch);

    console.log("Match created:", matchCreationData);

    //relateRecordedUserToMatch(requestData.owner_id, `${matchCreationData.id.tb}:${matchCreationData.id.id}`);

    await relateRecordedUserToMatch(
      requestData.owner_id,
      `${matchCreationData.id.tb}:${matchCreationData.id.id}`,
    );
    return NextResponse.json(matchCreationData, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création du match" },
      { status: 500 },
    );
  }
}
