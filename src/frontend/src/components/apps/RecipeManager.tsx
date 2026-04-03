import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const ACCENT = "rgba(244,63,94,";
const BG = "rgba(11,15,18,0.6)";
const SIDEBAR_BG = "rgba(10,16,20,0.7)";
const BORDER = "rgba(42,58,66,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.4)";

type Difficulty = "Easy" | "Medium" | "Hard";
type Category = "All" | "Breakfast" | "Lunch" | "Dinner" | "Snacks" | "Drinks";

interface Recipe {
  id: number;
  name: string;
  emoji: string;
  category: Exclude<Category, "All">;
  prepTime: number;
  servings: number;
  difficulty: Difficulty;
  ingredients: string[];
  instructions: string[];
}

const EMOJIS = ["🍳", "🥑", "🍝", "🥤", "🍜", "🥗", "🍕", "🍰"];

const INITIAL_RECIPES: Recipe[] = [
  {
    id: 1,
    name: "Avocado Toast",
    emoji: "🥑",
    category: "Breakfast",
    prepTime: 10,
    servings: 1,
    difficulty: "Easy",
    ingredients: [
      "2 slices sourdough bread",
      "1 ripe avocado",
      "Salt and pepper",
      "Red pepper flakes",
      "1 lemon",
    ],
    instructions: [
      "Toast the bread until golden brown.",
      "Mash the avocado with lemon juice, salt, and pepper.",
      "Spread the avocado mixture on the toast.",
      "Top with red pepper flakes and serve immediately.",
    ],
  },
  {
    id: 2,
    name: "Pasta Carbonara",
    emoji: "🍝",
    category: "Dinner",
    prepTime: 25,
    servings: 2,
    difficulty: "Medium",
    ingredients: [
      "200g spaghetti",
      "100g pancetta or guanciale",
      "2 large eggs",
      "50g Pecorino Romano",
      "50g Parmesan",
      "Black pepper",
      "Salt",
    ],
    instructions: [
      "Boil pasta in salted water until al dente.",
      "Fry pancetta in a pan until crispy.",
      "Whisk eggs with grated cheese and black pepper.",
      "Drain pasta, reserving some water.",
      "Off heat, toss pasta with pancetta, then egg mixture.",
      "Add pasta water to loosen. Serve immediately.",
    ],
  },
  {
    id: 3,
    name: "Green Smoothie",
    emoji: "🥤",
    category: "Drinks",
    prepTime: 5,
    servings: 1,
    difficulty: "Easy",
    ingredients: [
      "1 cup spinach",
      "1 banana",
      "1 cup almond milk",
      "1 tbsp honey",
      "1/2 cup frozen mango",
    ],
    instructions: [
      "Add all ingredients to a blender.",
      "Blend on high for 60 seconds until smooth.",
      "Pour into a glass and serve immediately.",
    ],
  },
];

const DIFF_COLORS: Record<Difficulty, string> = {
  Easy: "rgba(34,197,94,0.8)",
  Medium: "rgba(250,204,21,0.8)",
  Hard: "rgba(244,63,94,0.8)",
};

type FormState = Omit<Recipe, "id" | "ingredients" | "instructions"> & {
  ingredients: string;
  instructions: string;
};

const defaultForm = (): FormState => ({
  name: "",
  emoji: "🍳",
  category: "Breakfast",
  prepTime: 15,
  servings: 2,
  difficulty: "Easy",
  ingredients: "",
  instructions: "",
});

export function RecipeManager({
  windowProps: _windowProps,
}: { windowProps?: Record<string, unknown> }) {
  const {
    data: recipes,
    set: setRecipes,
    loading,
  } = useCanisterKV<Recipe[]>("decentos_recipes", INITIAL_RECIPES);
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm());
  const [nextId, setNextId] = useState(100);

  const categories: Category[] = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Drinks",
  ];

  const filtered = recipes.filter((r) => {
    const matchCat = category === "All" || r.category === category;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const startAdd = () => {
    setForm(defaultForm());
    setEditing(true);
    setSelected(null);
  };
  const startEdit = (r: Recipe) => {
    setForm({
      name: r.name,
      emoji: r.emoji,
      category: r.category,
      prepTime: r.prepTime,
      servings: r.servings,
      difficulty: r.difficulty,
      ingredients: r.ingredients.join("\n"),
      instructions: r.instructions.join("\n"),
    });
    setEditing(true);
  };

  const saveRecipe = () => {
    if (!form.name.trim()) return;
    const parsed: Recipe = {
      id: selected ? selected.id : nextId,
      name: form.name,
      emoji: form.emoji,
      category: form.category,
      prepTime: form.prepTime,
      servings: form.servings,
      difficulty: form.difficulty,
      ingredients: form.ingredients.split("\n").filter((l) => l.trim()),
      instructions: form.instructions.split("\n").filter((l) => l.trim()),
    };
    let updated: Recipe[];
    if (selected) {
      updated = recipes.map((r) => (r.id === selected.id ? parsed : r));
    } else {
      updated = [...recipes, parsed];
      setNextId((n) => n + 1);
    }
    setRecipes(updated);
    setSelected(parsed);
    setEditing(false);
  };

  const deleteRecipe = (id: number) => {
    setRecipes(recipes.filter((r) => r.id !== id));
    setSelected(null);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          background: BG,
        }}
      >
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: `${ACCENT}0.7)` }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        background: BG,
        color: TEXT,
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 220,
          minWidth: 220,
          background: SIDEBAR_BG,
          borderRight: `1px solid ${BORDER}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "10px 10px 6px" }}>
          <Input
            data-ocid="recipes.search_input"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "rgba(20,30,36,0.8)",
              border: `1px solid ${BORDER}`,
              color: TEXT,
              fontSize: 12,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            padding: "4px 10px 8px",
          }}
        >
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              data-ocid="recipes.tab"
              onClick={() => setCategory(c)}
              style={{
                fontSize: 10,
                padding: "2px 7px",
                borderRadius: 999,
                border: `1px solid ${category === c ? `${ACCENT}0.8)` : BORDER}`,
                background: category === c ? `${ACCENT}0.15)` : "transparent",
                color: category === c ? `${ACCENT}1)` : MUTED,
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <ScrollArea style={{ flex: 1 }}>
          <div style={{ padding: "0 6px" }}>
            {filtered.map((r, i) => (
              <div
                key={r.id}
                data-ocid={`recipes.item.${i + 1}`}
                onClick={() => {
                  setSelected(r);
                  setEditing(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSelected(r);
                    setEditing(false);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 8px",
                  borderRadius: 6,
                  cursor: "pointer",
                  marginBottom: 2,
                  background:
                    selected?.id === r.id ? `${ACCENT}0.12)` : "transparent",
                  border: `1px solid ${selected?.id === r.id ? `${ACCENT}0.4)` : "transparent"}`,
                }}
              >
                <span style={{ fontSize: 20 }}>{r.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 2,
                    }}
                  >
                    <span style={{ fontSize: 10, color: MUTED }}>
                      {r.prepTime}m
                    </span>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: DIFF_COLORS[r.difficulty],
                        display: "inline-block",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div style={{ padding: 8 }}>
          <Button
            type="button"
            data-ocid="recipes.primary_button"
            onClick={startAdd}
            style={{
              width: "100%",
              background: `${ACCENT}0.8)`,
              border: "none",
              color: "var(--os-text-primary)",
              fontSize: 12,
            }}
          >
            + New Recipe
          </Button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {editing ? (
          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
              {selected ? "Edit Recipe" : "New Recipe"}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <label
                  htmlFor="recipe-name"
                  style={{
                    fontSize: 11,
                    color: MUTED,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Name
                </label>
                <Input
                  id="recipe-name"
                  data-ocid="recipes.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  style={{
                    background: "rgba(20,30,36,0.8)",
                    border: `1px solid ${BORDER}`,
                    color: TEXT,
                    fontSize: 13,
                  }}
                />
              </div>
              <div>
                <span
                  style={{
                    fontSize: 11,
                    color: MUTED,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Emoji
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                      style={{
                        fontSize: 18,
                        background:
                          form.emoji === e ? `${ACCENT}0.2)` : "transparent",
                        border: `1px solid ${form.emoji === e ? `${ACCENT}0.5)` : BORDER}`,
                        borderRadius: 6,
                        padding: "2px 4px",
                        cursor: "pointer",
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="recipe-category"
                  style={{
                    fontSize: 11,
                    color: MUTED,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Category
                </label>
                <select
                  id="recipe-category"
                  data-ocid="recipes.select"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      category: e.target.value as Exclude<Category, "All">,
                    }))
                  }
                  style={{
                    width: "100%",
                    background: "rgba(20,30,36,0.8)",
                    border: `1px solid ${BORDER}`,
                    color: TEXT,
                    borderRadius: 6,
                    padding: "6px 8px",
                    fontSize: 13,
                  }}
                >
                  {(
                    [
                      "Breakfast",
                      "Lunch",
                      "Dinner",
                      "Snacks",
                      "Drinks",
                    ] as const
                  ).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label
                    htmlFor="recipe-preptime"
                    style={{
                      fontSize: 11,
                      color: MUTED,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Prep Time (min)
                  </label>
                  <Input
                    id="recipe-preptime"
                    type="number"
                    value={form.prepTime}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        prepTime: Number(e.target.value),
                      }))
                    }
                    style={{
                      background: "rgba(20,30,36,0.8)",
                      border: `1px solid ${BORDER}`,
                      color: TEXT,
                      fontSize: 13,
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    htmlFor="recipe-servings"
                    style={{
                      fontSize: 11,
                      color: MUTED,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Servings
                  </label>
                  <Input
                    id="recipe-servings"
                    type="number"
                    value={form.servings}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        servings: Number(e.target.value),
                      }))
                    }
                    style={{
                      background: "rgba(20,30,36,0.8)",
                      border: `1px solid ${BORDER}`,
                      color: TEXT,
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="recipe-difficulty"
                  style={{
                    fontSize: 11,
                    color: MUTED,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Difficulty
                </label>
                <select
                  id="recipe-difficulty"
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      difficulty: e.target.value as Difficulty,
                    }))
                  }
                  style={{
                    width: "100%",
                    background: "rgba(20,30,36,0.8)",
                    border: `1px solid ${BORDER}`,
                    color: TEXT,
                    borderRadius: 6,
                    padding: "6px 8px",
                    fontSize: 13,
                  }}
                >
                  {(["Easy", "Medium", "Hard"] as const).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label
                htmlFor="recipe-ingredients"
                style={{
                  fontSize: 11,
                  color: MUTED,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Ingredients (one per line)
              </label>
              <Textarea
                id="recipe-ingredients"
                data-ocid="recipes.textarea"
                value={form.ingredients}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ingredients: e.target.value }))
                }
                rows={5}
                style={{
                  background: "rgba(20,30,36,0.8)",
                  border: `1px solid ${BORDER}`,
                  color: TEXT,
                  fontSize: 13,
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="recipe-instructions"
                style={{
                  fontSize: 11,
                  color: MUTED,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Instructions (one step per line)
              </label>
              <Textarea
                id="recipe-instructions"
                value={form.instructions}
                onChange={(e) =>
                  setForm((f) => ({ ...f, instructions: e.target.value }))
                }
                rows={5}
                style={{
                  background: "rgba(20,30,36,0.8)",
                  border: `1px solid ${BORDER}`,
                  color: TEXT,
                  fontSize: 13,
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                type="button"
                data-ocid="recipes.submit_button"
                onClick={saveRecipe}
                style={{
                  background: `${ACCENT}0.8)`,
                  border: "none",
                  color: "var(--os-text-primary)",
                }}
              >
                Save Recipe
              </Button>
              <Button
                type="button"
                data-ocid="recipes.cancel_button"
                onClick={() => setEditing(false)}
                variant="outline"
                style={{ borderColor: BORDER, color: TEXT }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : selected ? (
          <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 40 }}>{selected.emoji}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  {selected.name}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <Badge
                    style={{
                      background: `${ACCENT}0.15)`,
                      color: `${ACCENT}1)`,
                      border: `1px solid ${ACCENT}0.3)`,
                      fontSize: 11,
                    }}
                  >
                    {selected.category}
                  </Badge>
                  <Badge
                    style={{
                      background: "var(--os-border-subtle)",
                      color: MUTED,
                      border: `1px solid ${BORDER}`,
                      fontSize: 11,
                    }}
                  >
                    ⏱ {selected.prepTime} min
                  </Badge>
                  <Badge
                    style={{
                      background: "var(--os-border-subtle)",
                      color: MUTED,
                      border: `1px solid ${BORDER}`,
                      fontSize: 11,
                    }}
                  >
                    🍽 {selected.servings} servings
                  </Badge>
                  <Badge
                    style={{
                      background: "rgba(50,50,50,0.3)",
                      color: DIFF_COLORS[selected.difficulty],
                      border: `1px solid ${DIFF_COLORS[selected.difficulty]}`,
                      fontSize: 11,
                    }}
                  >
                    {selected.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
            <div
              style={{
                borderTop: `1px solid ${BORDER}`,
                paddingTop: 16,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: `${ACCENT}1)`,
                  marginBottom: 10,
                }}
              >
                Ingredients
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {selected.ingredients.map((ing) => (
                  <li key={ing} style={{ fontSize: 13, color: TEXT }}>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div
              style={{
                borderTop: `1px solid ${BORDER}`,
                paddingTop: 16,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: `${ACCENT}1)`,
                  marginBottom: 10,
                }}
              >
                Instructions
              </div>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {selected.instructions.map((step) => (
                  <li
                    key={step}
                    style={{ fontSize: 13, color: TEXT, lineHeight: 1.6 }}
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                type="button"
                data-ocid="recipes.edit_button"
                onClick={() => startEdit(selected)}
                style={{
                  background: `${ACCENT}0.15)`,
                  border: `1px solid ${ACCENT}0.4)`,
                  color: `${ACCENT}1)`,
                }}
              >
                Edit
              </Button>
              <Button
                type="button"
                data-ocid="recipes.delete_button"
                onClick={() => deleteRecipe(selected.id)}
                variant="outline"
                style={{
                  borderColor: "rgba(244,63,94,0.4)",
                  color: "rgba(244,63,94,0.8)",
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div
            data-ocid="recipes.empty_state"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 12,
              color: MUTED,
            }}
          >
            <span style={{ fontSize: 40 }}>🍳</span>
            <div style={{ fontSize: 14 }}>
              Select a recipe or create a new one
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
