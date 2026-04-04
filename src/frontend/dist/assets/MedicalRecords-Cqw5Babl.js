import { r as reactExports, j as jsxRuntimeExports, T as Trash2 } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
const DEFAULT = {
  records: [
    {
      id: "r1",
      date: "2026-01-15",
      type: "visit",
      provider: "Dr. Sarah Chen",
      notes: "Annual physical exam — all results normal",
      result: "Normal"
    }
  ],
  medications: [
    {
      id: "m1",
      name: "Vitamin D3",
      dosage: "2000 IU",
      frequency: "Daily",
      prescriber: "Self",
      startDate: "2025-06-01"
    }
  ],
  allergies: [
    {
      id: "a1",
      allergen: "Penicillin",
      severity: "severe",
      notes: "Hives and difficulty breathing"
    }
  ],
  vaccinations: [
    {
      id: "v1",
      vaccine: "COVID-19 Booster",
      date: "2025-09-10",
      nextDue: "",
      provider: "Local Pharmacy"
    }
  ],
  doctors: [
    {
      id: "d1",
      name: "Dr. Sarah Chen",
      specialty: "Primary Care",
      phone: "(555) 123-4567",
      address: "123 Medical Center Dr",
      notes: "Annual checkups"
    }
  ]
};
const RECORD_COLORS = {
  visit: "rgba(59,130,246,0.8)",
  lab: "rgba(34,197,94,0.8)",
  imaging: "rgba(168,85,247,0.8)",
  procedure: "rgba(249,115,22,0.8)"
};
const SEV_COLORS = {
  mild: "rgba(34,197,94,0.8)",
  moderate: "rgba(249,115,22,0.8)",
  severe: "rgba(239,68,68,0.8)"
};
function genId() {
  return Math.random().toString(36).slice(2, 9);
}
const s = { background: "rgba(18,10,12,0.9)", color: "var(--os-text-primary)" };
const inp = {
  background: "rgba(30,10,14,0.7)",
  border: "1px solid rgba(239,68,68,0.2)",
  color: "var(--os-text-primary)",
  borderRadius: 6,
  padding: "6px 10px",
  outline: "none",
  width: "100%",
  fontSize: 12
};
const card = {
  background: "rgba(239,68,68,0.04)",
  border: "1px solid rgba(239,68,68,0.15)",
  borderRadius: 8,
  padding: "10px 12px"
};
function MedicalRecords() {
  const { data, set } = useCanisterKV("medical_data", DEFAULT);
  const [tab, setTab] = reactExports.useState("records");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [rDate, setRDate] = reactExports.useState("");
  const [rType, setRType] = reactExports.useState("visit");
  const [rProvider, setRProvider] = reactExports.useState("");
  const [rNotes, setRNotes] = reactExports.useState("");
  const [rResult, setRResult] = reactExports.useState("");
  const [mName, setMName] = reactExports.useState("");
  const [mDosage, setMDosage] = reactExports.useState("");
  const [mFreq, setMFreq] = reactExports.useState("");
  const [mPrescriber, setMPrescriber] = reactExports.useState("");
  const [mStart, setMStart] = reactExports.useState("");
  const [aAllergen, setAAllergen] = reactExports.useState("");
  const [aSev, setASev] = reactExports.useState("mild");
  const [aNotes, setANotes] = reactExports.useState("");
  const [vVaccine, setVVaccine] = reactExports.useState("");
  const [vDate, setVDate] = reactExports.useState("");
  const [vNext, setVNext] = reactExports.useState("");
  const [vProvider, setVProvider] = reactExports.useState("");
  const [dName, setDName] = reactExports.useState("");
  const [dSpec, setDSpec] = reactExports.useState("");
  const [dPhone, setDPhone] = reactExports.useState("");
  const [dAddr, setDAddr] = reactExports.useState("");
  const [dNotes, setDNotes] = reactExports.useState("");
  const handleAdd = () => {
    if (tab === "records" && rDate && rProvider) {
      set({
        ...data,
        records: [
          {
            id: genId(),
            date: rDate,
            type: rType,
            provider: rProvider,
            notes: rNotes,
            result: rResult
          },
          ...data.records
        ]
      });
      setRDate("");
      setRProvider("");
      setRNotes("");
      setRResult("");
    } else if (tab === "medications" && mName) {
      set({
        ...data,
        medications: [
          {
            id: genId(),
            name: mName,
            dosage: mDosage,
            frequency: mFreq,
            prescriber: mPrescriber,
            startDate: mStart
          },
          ...data.medications
        ]
      });
      setMName("");
      setMDosage("");
      setMFreq("");
      setMPrescriber("");
      setMStart("");
    } else if (tab === "allergies" && aAllergen) {
      set({
        ...data,
        allergies: [
          { id: genId(), allergen: aAllergen, severity: aSev, notes: aNotes },
          ...data.allergies
        ]
      });
      setAAllergen("");
      setANotes("");
    } else if (tab === "vaccinations" && vVaccine && vDate) {
      set({
        ...data,
        vaccinations: [
          {
            id: genId(),
            vaccine: vVaccine,
            date: vDate,
            nextDue: vNext,
            provider: vProvider
          },
          ...data.vaccinations
        ]
      });
      setVVaccine("");
      setVDate("");
      setVNext("");
      setVProvider("");
    } else if (tab === "doctors" && dName) {
      set({
        ...data,
        doctors: [
          {
            id: genId(),
            name: dName,
            specialty: dSpec,
            phone: dPhone,
            address: dAddr,
            notes: dNotes
          },
          ...data.doctors
        ]
      });
      setDName("");
      setDSpec("");
      setDPhone("");
      setDAddr("");
      setDNotes("");
    }
    setShowAdd(false);
  };
  const del = (section, id) => {
    set({
      ...data,
      [section]: data[section].filter((x) => x.id !== id)
    });
  };
  const TABS = [
    { id: "records", label: "Records" },
    { id: "medications", label: "Medications" },
    { id: "allergies", label: "Allergies" },
    { id: "vaccinations", label: "Vaccines" },
    { id: "doctors", label: "Doctors" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: s,
      "data-ocid": "medicalrecords.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0",
            style: {
              borderColor: "rgba(239,68,68,0.2)",
              background: "rgba(30,10,14,0.6)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "🏥" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-sm font-semibold",
                    style: { color: "rgba(239,100,100,1)" },
                    children: "Medical Records"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setShowAdd(!showAdd),
                  "data-ocid": "medicalrecords.primary_button",
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  style: {
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    color: "rgba(239,120,120,1)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                    " Add"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex border-b flex-shrink-0 overflow-x-auto",
            style: {
              borderColor: "rgba(239,68,68,0.1)",
              background: "rgba(20,8,10,0.5)"
            },
            children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setTab(t.id);
                  setShowAdd(false);
                },
                "data-ocid": "medicalrecords.tab",
                className: "px-4 py-2 text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors",
                style: {
                  borderBottom: tab === t.id ? "2px solid rgba(239,68,68,0.8)" : "2px solid transparent",
                  color: tab === t.id ? "rgba(239,120,120,1)" : "var(--os-text-muted)"
                },
                children: t.label
              },
              t.id
            ))
          }
        ),
        showAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "mx-4 mt-3 p-4 rounded-xl flex-shrink-0",
            style: {
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.2)"
            },
            "data-ocid": "medicalrecords.modal",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mb-2", children: [
                tab === "records" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: rDate,
                      onChange: (e) => setRDate(e.target.value),
                      type: "date",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      value: rType,
                      onChange: (e) => setRType(e.target.value),
                      style: inp,
                      "data-ocid": "medicalrecords.select",
                      children: ["visit", "lab", "imaging", "procedure"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: rProvider,
                      onChange: (e) => setRProvider(e.target.value),
                      placeholder: "Provider",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: rResult,
                      onChange: (e) => setRResult(e.target.value),
                      placeholder: "Result",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: rNotes,
                      onChange: (e) => setRNotes(e.target.value),
                      placeholder: "Notes",
                      style: { ...inp, gridColumn: "span 2" },
                      "data-ocid": "medicalrecords.input"
                    }
                  )
                ] }),
                tab === "medications" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: mName,
                      onChange: (e) => setMName(e.target.value),
                      placeholder: "Medication name",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: mDosage,
                      onChange: (e) => setMDosage(e.target.value),
                      placeholder: "Dosage",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: mFreq,
                      onChange: (e) => setMFreq(e.target.value),
                      placeholder: "Frequency",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: mPrescriber,
                      onChange: (e) => setMPrescriber(e.target.value),
                      placeholder: "Prescriber",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: mStart,
                      onChange: (e) => setMStart(e.target.value),
                      type: "date",
                      placeholder: "Start date",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  )
                ] }),
                tab === "allergies" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: aAllergen,
                      onChange: (e) => setAAllergen(e.target.value),
                      placeholder: "Allergen",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      value: aSev,
                      onChange: (e) => setASev(e.target.value),
                      style: inp,
                      "data-ocid": "medicalrecords.select",
                      children: ["mild", "moderate", "severe"].map((s2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s2, children: s2 }, s2))
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: aNotes,
                      onChange: (e) => setANotes(e.target.value),
                      placeholder: "Notes",
                      style: { ...inp, gridColumn: "span 2" },
                      "data-ocid": "medicalrecords.input"
                    }
                  )
                ] }),
                tab === "vaccinations" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: vVaccine,
                      onChange: (e) => setVVaccine(e.target.value),
                      placeholder: "Vaccine name",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: vDate,
                      onChange: (e) => setVDate(e.target.value),
                      type: "date",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: vNext,
                      onChange: (e) => setVNext(e.target.value),
                      type: "date",
                      placeholder: "Next due date",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: vProvider,
                      onChange: (e) => setVProvider(e.target.value),
                      placeholder: "Provider",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  )
                ] }),
                tab === "doctors" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: dName,
                      onChange: (e) => setDName(e.target.value),
                      placeholder: "Name",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: dSpec,
                      onChange: (e) => setDSpec(e.target.value),
                      placeholder: "Specialty",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: dPhone,
                      onChange: (e) => setDPhone(e.target.value),
                      placeholder: "Phone",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: dAddr,
                      onChange: (e) => setDAddr(e.target.value),
                      placeholder: "Address",
                      style: inp,
                      "data-ocid": "medicalrecords.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: dNotes,
                      onChange: (e) => setDNotes(e.target.value),
                      placeholder: "Notes",
                      style: { ...inp, gridColumn: "span 2" },
                      "data-ocid": "medicalrecords.input"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleAdd,
                    "data-ocid": "medicalrecords.confirm_button",
                    className: "px-4 py-1.5 rounded text-xs font-semibold",
                    style: {
                      background: "rgba(239,68,68,0.2)",
                      border: "1px solid rgba(239,68,68,0.4)",
                      color: "rgba(239,120,120,1)"
                    },
                    children: "Save"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowAdd(false),
                    "data-ocid": "medicalrecords.cancel_button",
                    className: "px-4 py-1.5 rounded text-xs",
                    style: { color: "var(--os-text-secondary)" },
                    children: "Cancel"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 flex flex-col gap-2", children: [
          tab === "records" && (data.records.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center py-8 text-sm text-muted-foreground/60",
              "data-ocid": "medicalrecords.empty_state",
              children: "No records yet"
            }
          ) : data.records.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: card,
              className: "flex items-start gap-3",
              "data-ocid": `medicalrecords.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0",
                    style: {
                      background: `${RECORD_COLORS[r.type]}22`,
                      color: RECORD_COLORS[r.type]
                    },
                    children: r.type
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground", children: r.provider }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60", children: r.date })
                  ] }),
                  r.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground/60 mt-0.5", children: r.notes }),
                  r.result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "text-[11px] mt-0.5",
                      style: { color: "rgba(239,120,120,0.8)" },
                      children: [
                        "Result: ",
                        r.result
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => del("records", r.id),
                    "data-ocid": "medicalrecords.delete_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 text-red-500/40 hover:text-red-400" })
                  }
                )
              ]
            },
            r.id
          ))),
          tab === "medications" && (data.medications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center py-8 text-sm text-muted-foreground/60",
              "data-ocid": "medicalrecords.empty_state",
              children: "No medications"
            }
          ) : data.medications.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: card,
              className: "flex items-start gap-3",
              "data-ocid": `medicalrecords.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs font-semibold",
                        style: { color: "rgba(239,120,120,1)" },
                        children: m.name
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60", children: m.dosage })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground/60 mt-0.5", children: [
                    m.frequency,
                    " ",
                    m.prescriber && `· Prescribed by ${m.prescriber}`,
                    " ",
                    m.startDate && `· Since ${m.startDate}`
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => del("medications", m.id),
                    "data-ocid": "medicalrecords.delete_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 text-red-500/40 hover:text-red-400" })
                  }
                )
              ]
            },
            m.id
          ))),
          tab === "allergies" && (data.allergies.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center py-8 text-sm text-muted-foreground/60",
              "data-ocid": "medicalrecords.empty_state",
              children: "No allergies recorded"
            }
          ) : data.allergies.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: card,
              className: "flex items-start gap-3",
              "data-ocid": `medicalrecords.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0",
                    style: {
                      background: `${SEV_COLORS[a.severity]}22`,
                      color: SEV_COLORS[a.severity]
                    },
                    children: a.severity
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-muted-foreground", children: a.allergen }),
                  a.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground/60 mt-0.5", children: a.notes })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => del("allergies", a.id),
                    "data-ocid": "medicalrecords.delete_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 text-red-500/40 hover:text-red-400" })
                  }
                )
              ]
            },
            a.id
          ))),
          tab === "vaccinations" && (data.vaccinations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center py-8 text-sm text-muted-foreground/60",
              "data-ocid": "medicalrecords.empty_state",
              children: "No vaccinations recorded"
            }
          ) : data.vaccinations.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: card,
              className: "flex items-start gap-3",
              "data-ocid": `medicalrecords.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground", children: v.vaccine }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60", children: v.date })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground/60 mt-0.5", children: [
                    v.provider && `Provider: ${v.provider}`,
                    " ",
                    v.nextDue && `· Next due: ${v.nextDue}`
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => del("vaccinations", v.id),
                    "data-ocid": "medicalrecords.delete_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 text-red-500/40 hover:text-red-400" })
                  }
                )
              ]
            },
            v.id
          ))),
          tab === "doctors" && (data.doctors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center py-8 text-sm text-muted-foreground/60",
              "data-ocid": "medicalrecords.empty_state",
              children: "No doctors added"
            }
          ) : data.doctors.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: card,
              className: "flex items-start gap-3",
              "data-ocid": `medicalrecords.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs font-semibold",
                        style: { color: "rgba(239,120,120,1)" },
                        children: d.name
                      }
                    ),
                    d.specialty && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60", children: d.specialty })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground/60 mt-0.5", children: [d.phone, d.address].filter(Boolean).join(" · ") }),
                  d.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground/60 mt-0.5", children: d.notes })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => del("doctors", d.id),
                    "data-ocid": "medicalrecords.delete_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 text-red-500/40 hover:text-red-400" })
                  }
                )
              ]
            },
            d.id
          )))
        ] })
      ]
    }
  );
}
export {
  MedicalRecords
};
