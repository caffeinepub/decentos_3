import { r as reactExports, j as jsxRuntimeExports } from "./index-CZGIn5x2.js";
import { B as Badge } from "./badge-D2FbqHYW.js";
import { B as Button } from "./button-DBwl-7M-.js";
import { I as Input } from "./input-C2UuKq0p.js";
import { S as ScrollArea } from "./scroll-area-0_61eqCO.js";
import { T as Textarea } from "./textarea-Bhc13Xgf.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { L as LoaderCircle } from "./loader-circle-CDA4iBPc.js";
import "./utils-C29Fbx4G.js";
import "./index-B265m3O3.js";
import "./index-B9-lQkRo.js";
import "./index-YwGfiBwk.js";
import "./index-DxR-hlVQ.js";
import "./index-DfmnWLAm.js";
import "./index-C4X58sdz.js";
import "./index-9Nd72esH.js";
import "./index-IXOTxK3N.js";
const ACCENT = "rgba(244,63,94,";
const BG = "rgba(11,15,18,0.6)";
const SIDEBAR_BG = "rgba(10,16,20,0.7)";
const BORDER = "rgba(42,58,66,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.4)";
const EMOJIS = ["🍳", "🥑", "🍝", "🥤", "🍜", "🥗", "🍕", "🍰"];
const INITIAL_RECIPES = [
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
      "1 lemon"
    ],
    instructions: [
      "Toast the bread until golden brown.",
      "Mash the avocado with lemon juice, salt, and pepper.",
      "Spread the avocado mixture on the toast.",
      "Top with red pepper flakes and serve immediately."
    ]
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
      "Salt"
    ],
    instructions: [
      "Boil pasta in salted water until al dente.",
      "Fry pancetta in a pan until crispy.",
      "Whisk eggs with grated cheese and black pepper.",
      "Drain pasta, reserving some water.",
      "Off heat, toss pasta with pancetta, then egg mixture.",
      "Add pasta water to loosen. Serve immediately."
    ]
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
      "1/2 cup frozen mango"
    ],
    instructions: [
      "Add all ingredients to a blender.",
      "Blend on high for 60 seconds until smooth.",
      "Pour into a glass and serve immediately."
    ]
  }
];
const DIFF_COLORS = {
  Easy: "rgba(34,197,94,0.8)",
  Medium: "rgba(250,204,21,0.8)",
  Hard: "rgba(244,63,94,0.8)"
};
const defaultForm = () => ({
  name: "",
  emoji: "🍳",
  category: "Breakfast",
  prepTime: 15,
  servings: 2,
  difficulty: "Easy",
  ingredients: "",
  instructions: ""
});
function RecipeManager({
  windowProps: _windowProps
}) {
  const {
    data: recipes,
    set: setRecipes,
    loading
  } = useCanisterKV("decentos_recipes", INITIAL_RECIPES);
  const [selected, setSelected] = reactExports.useState(null);
  const [category, setCategory] = reactExports.useState("All");
  const [search, setSearch] = reactExports.useState("");
  const [editing, setEditing] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(defaultForm());
  const [nextId, setNextId] = reactExports.useState(100);
  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Drinks"
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
  const startEdit = (r) => {
    setForm({
      name: r.name,
      emoji: r.emoji,
      category: r.category,
      prepTime: r.prepTime,
      servings: r.servings,
      difficulty: r.difficulty,
      ingredients: r.ingredients.join("\n"),
      instructions: r.instructions.join("\n")
    });
    setEditing(true);
  };
  const saveRecipe = () => {
    if (!form.name.trim()) return;
    const parsed = {
      id: selected ? selected.id : nextId,
      name: form.name,
      emoji: form.emoji,
      category: form.category,
      prepTime: form.prepTime,
      servings: form.servings,
      difficulty: form.difficulty,
      ingredients: form.ingredients.split("\n").filter((l) => l.trim()),
      instructions: form.instructions.split("\n").filter((l) => l.trim())
    };
    let updated;
    if (selected) {
      updated = recipes.map((r) => r.id === selected.id ? parsed : r);
    } else {
      updated = [...recipes, parsed];
      setNextId((n) => n + 1);
    }
    setRecipes(updated);
    setSelected(parsed);
    setEditing(false);
  };
  const deleteRecipe = (id) => {
    setRecipes(recipes.filter((r) => r.id !== id));
    setSelected(null);
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          background: BG
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          LoaderCircle,
          {
            className: "w-6 h-6 animate-spin",
            style: { color: `${ACCENT}0.7)` }
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        height: "100%",
        background: BG,
        color: TEXT,
        fontFamily: "sans-serif",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              width: 220,
              minWidth: 220,
              background: SIDEBAR_BG,
              borderRight: `1px solid ${BORDER}`,
              display: "flex",
              flexDirection: "column"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "10px 10px 6px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "recipes.search_input",
                  placeholder: "Search recipes...",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  style: {
                    background: "rgba(20,30,36,0.8)",
                    border: `1px solid ${BORDER}`,
                    color: TEXT,
                    fontSize: 12
                  }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    padding: "4px 10px 8px"
                  },
                  children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "recipes.tab",
                      onClick: () => setCategory(c),
                      style: {
                        fontSize: 10,
                        padding: "2px 7px",
                        borderRadius: 999,
                        border: `1px solid ${category === c ? `${ACCENT}0.8)` : BORDER}`,
                        background: category === c ? `${ACCENT}0.15)` : "transparent",
                        color: category === c ? `${ACCENT}1)` : MUTED,
                        cursor: "pointer"
                      },
                      children: c
                    },
                    c
                  ))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { style: { flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "0 6px" }, children: filtered.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `recipes.item.${i + 1}`,
                  onClick: () => {
                    setSelected(r);
                    setEditing(false);
                  },
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      setSelected(r);
                      setEditing(false);
                    }
                  },
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 8px",
                    borderRadius: 6,
                    cursor: "pointer",
                    marginBottom: 2,
                    background: (selected == null ? void 0 : selected.id) === r.id ? `${ACCENT}0.12)` : "transparent",
                    border: `1px solid ${(selected == null ? void 0 : selected.id) === r.id ? `${ACCENT}0.4)` : "transparent"}`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 20 }, children: r.emoji }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            fontSize: 12,
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          },
                          children: r.name
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginTop: 2
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 10, color: MUTED }, children: [
                              r.prepTime,
                              "m"
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: DIFF_COLORS[r.difficulty],
                                  display: "inline-block"
                                }
                              }
                            )
                          ]
                        }
                      )
                    ] })
                  ]
                },
                r.id
              )) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  "data-ocid": "recipes.primary_button",
                  onClick: startAdd,
                  style: {
                    width: "100%",
                    background: `${ACCENT}0.8)`,
                    border: "none",
                    color: "var(--os-text-primary)",
                    fontSize: 12
                  },
                  children: "+ New Recipe"
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            },
            children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "auto", padding: 20 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 15, fontWeight: 700, marginBottom: 16 }, children: selected ? "Edit Recipe" : "New Recipe" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 12
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: "recipe-name",
                          style: {
                            fontSize: 11,
                            color: MUTED,
                            display: "block",
                            marginBottom: 4
                          },
                          children: "Name"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "recipe-name",
                          "data-ocid": "recipes.input",
                          value: form.name,
                          onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
                          style: {
                            background: "rgba(20,30,36,0.8)",
                            border: `1px solid ${BORDER}`,
                            color: TEXT,
                            fontSize: 13
                          }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            fontSize: 11,
                            color: MUTED,
                            display: "block",
                            marginBottom: 4
                          },
                          children: "Emoji"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6 }, children: EMOJIS.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setForm((f) => ({ ...f, emoji: e })),
                          style: {
                            fontSize: 18,
                            background: form.emoji === e ? `${ACCENT}0.2)` : "transparent",
                            border: `1px solid ${form.emoji === e ? `${ACCENT}0.5)` : BORDER}`,
                            borderRadius: 6,
                            padding: "2px 4px",
                            cursor: "pointer"
                          },
                          children: e
                        },
                        e
                      )) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: "recipe-category",
                          style: {
                            fontSize: 11,
                            color: MUTED,
                            display: "block",
                            marginBottom: 4
                          },
                          children: "Category"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "select",
                        {
                          id: "recipe-category",
                          "data-ocid": "recipes.select",
                          value: form.category,
                          onChange: (e) => setForm((f) => ({
                            ...f,
                            category: e.target.value
                          })),
                          style: {
                            width: "100%",
                            background: "rgba(20,30,36,0.8)",
                            border: `1px solid ${BORDER}`,
                            color: TEXT,
                            borderRadius: 6,
                            padding: "6px 8px",
                            fontSize: 13
                          },
                          children: [
                            "Breakfast",
                            "Lunch",
                            "Dinner",
                            "Snacks",
                            "Drinks"
                          ].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: "recipe-preptime",
                            style: {
                              fontSize: 11,
                              color: MUTED,
                              display: "block",
                              marginBottom: 4
                            },
                            children: "Prep Time (min)"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            id: "recipe-preptime",
                            type: "number",
                            value: form.prepTime,
                            onChange: (e) => setForm((f) => ({
                              ...f,
                              prepTime: Number(e.target.value)
                            })),
                            style: {
                              background: "rgba(20,30,36,0.8)",
                              border: `1px solid ${BORDER}`,
                              color: TEXT,
                              fontSize: 13
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: "recipe-servings",
                            style: {
                              fontSize: 11,
                              color: MUTED,
                              display: "block",
                              marginBottom: 4
                            },
                            children: "Servings"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            id: "recipe-servings",
                            type: "number",
                            value: form.servings,
                            onChange: (e) => setForm((f) => ({
                              ...f,
                              servings: Number(e.target.value)
                            })),
                            style: {
                              background: "rgba(20,30,36,0.8)",
                              border: `1px solid ${BORDER}`,
                              color: TEXT,
                              fontSize: 13
                            }
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: "recipe-difficulty",
                          style: {
                            fontSize: 11,
                            color: MUTED,
                            display: "block",
                            marginBottom: 4
                          },
                          children: "Difficulty"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "select",
                        {
                          id: "recipe-difficulty",
                          value: form.difficulty,
                          onChange: (e) => setForm((f) => ({
                            ...f,
                            difficulty: e.target.value
                          })),
                          style: {
                            width: "100%",
                            background: "rgba(20,30,36,0.8)",
                            border: `1px solid ${BORDER}`,
                            color: TEXT,
                            borderRadius: 6,
                            padding: "6px 8px",
                            fontSize: 13
                          },
                          children: ["Easy", "Medium", "Hard"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: d, children: d }, d))
                        }
                      )
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 12 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "recipe-ingredients",
                    style: {
                      fontSize: 11,
                      color: MUTED,
                      display: "block",
                      marginBottom: 4
                    },
                    children: "Ingredients (one per line)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "recipe-ingredients",
                    "data-ocid": "recipes.textarea",
                    value: form.ingredients,
                    onChange: (e) => setForm((f) => ({ ...f, ingredients: e.target.value })),
                    rows: 5,
                    style: {
                      background: "rgba(20,30,36,0.8)",
                      border: `1px solid ${BORDER}`,
                      color: TEXT,
                      fontSize: 13,
                      resize: "vertical"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 16 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "recipe-instructions",
                    style: {
                      fontSize: 11,
                      color: MUTED,
                      display: "block",
                      marginBottom: 4
                    },
                    children: "Instructions (one step per line)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "recipe-instructions",
                    value: form.instructions,
                    onChange: (e) => setForm((f) => ({ ...f, instructions: e.target.value })),
                    rows: 5,
                    style: {
                      background: "rgba(20,30,36,0.8)",
                      border: `1px solid ${BORDER}`,
                      color: TEXT,
                      fontSize: 13,
                      resize: "vertical"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    "data-ocid": "recipes.submit_button",
                    onClick: saveRecipe,
                    style: {
                      background: `${ACCENT}0.8)`,
                      border: "none",
                      color: "var(--os-text-primary)"
                    },
                    children: "Save Recipe"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    "data-ocid": "recipes.cancel_button",
                    onClick: () => setEditing(false),
                    variant: "outline",
                    style: { borderColor: BORDER, color: TEXT },
                    children: "Cancel"
                  }
                )
              ] })
            ] }) : selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "auto", padding: 24 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 40 }, children: selected.emoji }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 20, fontWeight: 700 }, children: selected.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, marginTop: 6 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            style: {
                              background: `${ACCENT}0.15)`,
                              color: `${ACCENT}1)`,
                              border: `1px solid ${ACCENT}0.3)`,
                              fontSize: 11
                            },
                            children: selected.category
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Badge,
                          {
                            style: {
                              background: "var(--os-border-subtle)",
                              color: MUTED,
                              border: `1px solid ${BORDER}`,
                              fontSize: 11
                            },
                            children: [
                              "⏱ ",
                              selected.prepTime,
                              " min"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Badge,
                          {
                            style: {
                              background: "var(--os-border-subtle)",
                              color: MUTED,
                              border: `1px solid ${BORDER}`,
                              fontSize: 11
                            },
                            children: [
                              "🍽 ",
                              selected.servings,
                              " servings"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            style: {
                              background: "rgba(50,50,50,0.3)",
                              color: DIFF_COLORS[selected.difficulty],
                              border: `1px solid ${DIFF_COLORS[selected.difficulty]}`,
                              fontSize: 11
                            },
                            children: selected.difficulty
                          }
                        )
                      ] })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    borderTop: `1px solid ${BORDER}`,
                    paddingTop: 16,
                    marginBottom: 16
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: 13,
                          fontWeight: 700,
                          color: `${ACCENT}1)`,
                          marginBottom: 10
                        },
                        children: "Ingredients"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "ul",
                      {
                        style: {
                          margin: 0,
                          paddingLeft: 20,
                          display: "flex",
                          flexDirection: "column",
                          gap: 4
                        },
                        children: selected.ingredients.map((ing) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { style: { fontSize: 13, color: TEXT }, children: ing }, ing))
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    borderTop: `1px solid ${BORDER}`,
                    paddingTop: 16,
                    marginBottom: 20
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: 13,
                          fontWeight: 700,
                          color: `${ACCENT}1)`,
                          marginBottom: 10
                        },
                        children: "Instructions"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "ol",
                      {
                        style: {
                          margin: 0,
                          paddingLeft: 20,
                          display: "flex",
                          flexDirection: "column",
                          gap: 8
                        },
                        children: selected.instructions.map((step) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "li",
                          {
                            style: { fontSize: 13, color: TEXT, lineHeight: 1.6 },
                            children: step
                          },
                          step
                        ))
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    "data-ocid": "recipes.edit_button",
                    onClick: () => startEdit(selected),
                    style: {
                      background: `${ACCENT}0.15)`,
                      border: `1px solid ${ACCENT}0.4)`,
                      color: `${ACCENT}1)`
                    },
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    "data-ocid": "recipes.delete_button",
                    onClick: () => deleteRecipe(selected.id),
                    variant: "outline",
                    style: {
                      borderColor: "rgba(244,63,94,0.4)",
                      color: "rgba(244,63,94,0.8)"
                    },
                    children: "Delete"
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "recipes.empty_state",
                style: {
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 12,
                  color: MUTED
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 40 }, children: "🍳" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14 }, children: "Select a recipe or create a new one" })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  RecipeManager
};
