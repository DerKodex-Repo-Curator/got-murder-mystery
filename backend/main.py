from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import json
import re
import random
from dotenv import load_dotenv
load_dotenv()
app = FastAPI(title="GOT Murder Mystery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic()

# ── Models ────────────────────────────────────────────────────────────────────

class GameState(BaseModel):
    scenario: dict | None = None
    clues_revealed: int = 0          # 0 = only first clue shown
    remaining_suspects: list[str] | None = None
    game_over: bool = False
    won: bool = False

class GuessRequest(BaseModel):
    game_state: GameState
    guess: str

class NewGameResponse(BaseModel):
    game_state: GameState
    current_clue: str
    message: str

class GuessResponse(BaseModel):
    game_state: GameState
    correct: bool
    message: str
    new_clue: str | None = None

# ── Helpers ───────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are a Game Master for a Game of Thrones murder mystery game.
Always respond with valid JSON only — no markdown, no extra text, no code fences."""


def call_llm(user_prompt: str) -> str:
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )
    return message.content[0].text


def safe_json(raw: str) -> dict:
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?", "", raw).rstrip("`").strip()
    return json.loads(raw)

# ── Endpoints ─────────────────────────────────────────────────────────────────

VICTIM_POOL = [
    "Ned Stark", "Robb Stark", "Catelyn Stark", "Joffrey Baratheon",
    "Tywin Lannister", "Oberyn Martell", "Stannis Baratheon", "Renly Baratheon",
    "Margaery Tyrell", "Shae", "Ros", "Selyse Baratheon", "Myrcella Baratheon",
    "Tommen Baratheon", "Grand Maester Pycelle", "Kevan Lannister",
    "Balon Greyjoy", "Rickard Karstark", "Roose Bolton", "Mance Rayder",
]

LOCATION_POOL = [
    "the Red Keep's throne room", "the godswood of Winterfell",
    "Littlefinger's brothel in King's Landing", "the Wall's Night Watch barracks",
    "Dragonstone's war room", "the Sept of Baelor", "Harrenhal's great hall",
    "a Dothraki sea camp", "the Iron Islands docks", "Casterly Rock's treasury",
    "the Vale's Eyrie", "the streets of Braavos", "a Lannister hunting party",
    "the Dreadfort's dungeons", "a royal feast at Storm's End",
    "the Tower of Joy in Dorne", "a raven tower in the Citadel",
    "the courtyard of the Water Gardens", "a ship on Blackwater Bay",
    "the crypts beneath Winterfell",
]

METHOD_POOL = [
    "poison slipped into wine", "a crossbow bolt from the shadows",
    "drowned in a barrel of Arbor gold", "stabbed with a Valyrian steel dagger",
    "pushed from a high window", "strangled with a golden chain",
    "burned alive in a locked chamber", "fed to the hounds",
    "killed by a sweetened milk laced with milk of the poppy",
    "throat slit during a moonlit prayer", "struck by a 'falling' stone parapet",
    "smothered with a pillow bearing the Lannister sigil",
]

SUSPECT_POOL = [
    "Cersei Lannister", "Tyrion Lannister", "Jaime Lannister",
    "Jon Snow", "Daenerys Targaryen", "Sansa Stark", "Arya Stark",
    "Petyr Baelish", "Varys", "Melisandre", "Theon Greyjoy",
    "Jorah Mormont", "Sandor Clegane", "Gregor Clegane",
    "Olenna Tyrell", "Loras Tyrell", "Davos Seaworth",
    "Bronn", "Qyburn", "Euron Greyjoy", "Ellaria Sand",
    "Samwell Tarly", "Brienne of Tarth", "Tormund Giantsbane",
]

@app.post("/new-game", response_model=NewGameResponse)
def new_game():
    # Pick random elements to force a unique scenario every time
    victim   = random.choice(VICTIM_POOL)
    location = random.choice(LOCATION_POOL)
    method   = random.choice(METHOD_POOL)
    seed     = random.randint(1000, 9999)

    # Pick 5 suspects that are NOT the victim
    suspect_candidates = [s for s in SUSPECT_POOL if s != victim]
    forced_suspects = random.sample(suspect_candidates, 5)
    suspects_str = ", ".join(forced_suspects)

    prompt = f"""Generate a unique Game of Thrones murder mystery. Randomness seed: {seed}.

REQUIRED SCENARIO CONSTRAINTS — you MUST use exactly these:
- Victim: {victim}
- Location: {location}
- Murder method: {method}
- Suspects (use ALL five of these, no substitutions): {suspects_str}

Return ONLY a JSON object with this exact structure:
{{
  "victim": "{victim}",
  "place": "{location}",
  "murder_method": "{method}",
  "killer": "<one of the 5 suspects above>",
  "killer_motive": "<a rich, specific GOT-style motive for the killer>",
  "suspects": [
    {{"name": "{forced_suspects[0]}", "motive": "<their unique motive>"}},
    {{"name": "{forced_suspects[1]}", "motive": "<their unique motive>"}},
    {{"name": "{forced_suspects[2]}", "motive": "<their unique motive>"}},
    {{"name": "{forced_suspects[3]}", "motive": "<their unique motive>"}},
    {{"name": "{forced_suspects[4]}", "motive": "<their unique motive>"}}
  ],
  "clues": [
    "<Clue 1: atmospheric and vague, sets the scene, no names>",
    "<Clue 2: hints at 3-4 suspects via indirect detail>",
    "<Clue 3: narrows to 2-3 suspects with a stronger hint>",
    "<Clue 4: nearly conclusive but still not naming the killer directly>"
  ]
}}

Rules:
- The killer MUST be one of the 5 named suspects above
- Each suspect must have a DISTINCT, plausible GOT-style motive (power, revenge, love, fear, loyalty, greed, etc.)
- Clues must be atmospheric and reference GOT lore, sigils, locations, or known events
- Do NOT name the killer in any clue
- Make the story feel fresh and specific — no generic motives"""

    raw = call_llm(prompt)
    scenario = safe_json(raw)

    # Validate killer is in suspects
    suspect_names = [s["name"] for s in scenario["suspects"]]
    if scenario["killer"] not in suspect_names:
        scenario["killer"] = suspect_names[0]

    game_state = GameState(
        scenario=scenario,
        clues_revealed=0,
        remaining_suspects=suspect_names,
        game_over=False,
        won=False,
    )

    return NewGameResponse(
        game_state=game_state,
        current_clue=scenario["clues"][0],
        message=f"A body has been discovered! {scenario['victim']} has been found dead at {scenario['place']}. "
                f"The method: {scenario['murder_method']}. Five suspects have been identified. Study the clue and name the killer.",
    )


@app.post("/guess", response_model=GuessResponse)
def make_guess(req: GuessRequest):
    gs = req.game_state
    scenario = gs.scenario

    if gs.game_over:
        raise HTTPException(status_code=400, detail="Game is already over.")

    killer = scenario["killer"]
    correct = req.guess.strip().lower() == killer.strip().lower()

    if correct:
        gs.game_over = True
        gs.won = True
        return GuessResponse(
            game_state=gs,
            correct=True,
            message=f"⚔️ Correct! {killer} is the killer! {scenario['killer_motive']} The realm's justice is served.",
        )

    # Wrong guess — remove guessed suspect from remaining
    remaining = [s for s in gs.remaining_suspects if s.strip().lower() != req.guess.strip().lower()]
    gs.remaining_suspects = remaining

    # Reveal next clue if available
    next_clue_index = gs.clues_revealed + 1
    clues = scenario["clues"]

    if len(remaining) <= 1:
        # Game over — out of suspects
        gs.game_over = True
        gs.won = False
        return GuessResponse(
            game_state=gs,
            correct=False,
            message=f"❌ Wrong again! The last suspect standing is {remaining[0] if remaining else '???'}, "
                    f"but the true killer was {killer}. {scenario['killer_motive']}",
            new_clue=None,
        )

    if next_clue_index < len(clues):
        gs.clues_revealed = next_clue_index
        new_clue = clues[next_clue_index]
    else:
        new_clue = None  # No more clues

    message = f"Wrong! {req.guess} is innocent. {len(remaining)} suspects remain."
    if new_clue:
        message += " A new clue has emerged from the shadows..."

    return GuessResponse(
        game_state=gs,
        correct=False,
        message=message,
        new_clue=new_clue,
    )


@app.get("/health")
def health():
    return {"status": "alive", "realm": "Westeros"}