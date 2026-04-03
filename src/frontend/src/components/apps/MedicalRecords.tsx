import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type RecordType = "visit" | "lab" | "imaging" | "procedure";
type Severity = "mild" | "moderate" | "severe";

interface MedRecord {
  id: string;
  date: string;
  type: RecordType;
  provider: string;
  notes: string;
  result: string;
}
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescriber: string;
  startDate: string;
}
interface Allergy {
  id: string;
  allergen: string;
  severity: Severity;
  notes: string;
}
interface Vaccination {
  id: string;
  vaccine: string;
  date: string;
  nextDue: string;
  provider: string;
}
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  address: string;
  notes: string;
}
interface MedData {
  records: MedRecord[];
  medications: Medication[];
  allergies: Allergy[];
  vaccinations: Vaccination[];
  doctors: Doctor[];
}

const DEFAULT: MedData = {
  records: [
    {
      id: "r1",
      date: "2026-01-15",
      type: "visit",
      provider: "Dr. Sarah Chen",
      notes: "Annual physical exam — all results normal",
      result: "Normal",
    },
  ],
  medications: [
    {
      id: "m1",
      name: "Vitamin D3",
      dosage: "2000 IU",
      frequency: "Daily",
      prescriber: "Self",
      startDate: "2025-06-01",
    },
  ],
  allergies: [
    {
      id: "a1",
      allergen: "Penicillin",
      severity: "severe",
      notes: "Hives and difficulty breathing",
    },
  ],
  vaccinations: [
    {
      id: "v1",
      vaccine: "COVID-19 Booster",
      date: "2025-09-10",
      nextDue: "",
      provider: "Local Pharmacy",
    },
  ],
  doctors: [
    {
      id: "d1",
      name: "Dr. Sarah Chen",
      specialty: "Primary Care",
      phone: "(555) 123-4567",
      address: "123 Medical Center Dr",
      notes: "Annual checkups",
    },
  ],
};

const RECORD_COLORS: Record<RecordType, string> = {
  visit: "rgba(59,130,246,0.8)",
  lab: "rgba(34,197,94,0.8)",
  imaging: "rgba(168,85,247,0.8)",
  procedure: "rgba(249,115,22,0.8)",
};
const SEV_COLORS: Record<Severity, string> = {
  mild: "rgba(34,197,94,0.8)",
  moderate: "rgba(249,115,22,0.8)",
  severe: "rgba(239,68,68,0.8)",
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
  fontSize: 12,
};
const card = {
  background: "rgba(239,68,68,0.04)",
  border: "1px solid rgba(239,68,68,0.15)",
  borderRadius: 8,
  padding: "10px 12px",
};
type Tab = "records" | "medications" | "allergies" | "vaccinations" | "doctors";

export function MedicalRecords() {
  const { data, set } = useCanisterKV<MedData>("medical_data", DEFAULT);
  const [tab, setTab] = useState<Tab>("records");
  const [showAdd, setShowAdd] = useState(false);

  // Record form
  const [rDate, setRDate] = useState("");
  const [rType, setRType] = useState<RecordType>("visit");
  const [rProvider, setRProvider] = useState("");
  const [rNotes, setRNotes] = useState("");
  const [rResult, setRResult] = useState("");
  // Medication form
  const [mName, setMName] = useState("");
  const [mDosage, setMDosage] = useState("");
  const [mFreq, setMFreq] = useState("");
  const [mPrescriber, setMPrescriber] = useState("");
  const [mStart, setMStart] = useState("");
  // Allergy form
  const [aAllergen, setAAllergen] = useState("");
  const [aSev, setASev] = useState<Severity>("mild");
  const [aNotes, setANotes] = useState("");
  // Vaccination form
  const [vVaccine, setVVaccine] = useState("");
  const [vDate, setVDate] = useState("");
  const [vNext, setVNext] = useState("");
  const [vProvider, setVProvider] = useState("");
  // Doctor form
  const [dName, setDName] = useState("");
  const [dSpec, setDSpec] = useState("");
  const [dPhone, setDPhone] = useState("");
  const [dAddr, setDAddr] = useState("");
  const [dNotes, setDNotes] = useState("");

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
            result: rResult,
          },
          ...data.records,
        ],
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
            startDate: mStart,
          },
          ...data.medications,
        ],
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
          ...data.allergies,
        ],
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
            provider: vProvider,
          },
          ...data.vaccinations,
        ],
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
            notes: dNotes,
          },
          ...data.doctors,
        ],
      });
      setDName("");
      setDSpec("");
      setDPhone("");
      setDAddr("");
      setDNotes("");
    }
    setShowAdd(false);
  };

  const del = (section: keyof MedData, id: string) => {
    set({
      ...data,
      [section]: (data[section] as { id: string }[]).filter((x) => x.id !== id),
    });
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: "records", label: "Records" },
    { id: "medications", label: "Medications" },
    { id: "allergies", label: "Allergies" },
    { id: "vaccinations", label: "Vaccines" },
    { id: "doctors", label: "Doctors" },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={s}
      data-ocid="medicalrecords.panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(239,68,68,0.2)",
          background: "rgba(30,10,14,0.6)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🏥</span>
          <span
            className="text-sm font-semibold"
            style={{ color: "rgba(239,100,100,1)" }}
          >
            Medical Records
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          data-ocid="medicalrecords.primary_button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.4)",
            color: "rgba(239,120,120,1)",
          }}
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b flex-shrink-0 overflow-x-auto"
        style={{
          borderColor: "rgba(239,68,68,0.1)",
          background: "rgba(20,8,10,0.5)",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              setShowAdd(false);
            }}
            data-ocid="medicalrecords.tab"
            className="px-4 py-2 text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors"
            style={{
              borderBottom:
                tab === t.id
                  ? "2px solid rgba(239,68,68,0.8)"
                  : "2px solid transparent",
              color:
                tab === t.id ? "rgba(239,120,120,1)" : "var(--os-text-muted)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showAdd && (
        <div
          className="mx-4 mt-3 p-4 rounded-xl flex-shrink-0"
          style={{
            background: "rgba(239,68,68,0.05)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
          data-ocid="medicalrecords.modal"
        >
          <div className="grid grid-cols-2 gap-2 mb-2">
            {tab === "records" && (
              <>
                <input
                  value={rDate}
                  onChange={(e) => setRDate(e.target.value)}
                  type="date"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <select
                  value={rType}
                  onChange={(e) => setRType(e.target.value as RecordType)}
                  style={inp}
                  data-ocid="medicalrecords.select"
                >
                  {(
                    ["visit", "lab", "imaging", "procedure"] as RecordType[]
                  ).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  value={rProvider}
                  onChange={(e) => setRProvider(e.target.value)}
                  placeholder="Provider"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <input
                  value={rResult}
                  onChange={(e) => setRResult(e.target.value)}
                  placeholder="Result"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <input
                  value={rNotes}
                  onChange={(e) => setRNotes(e.target.value)}
                  placeholder="Notes"
                  style={{ ...inp, gridColumn: "span 2" }}
                  data-ocid="medicalrecords.input"
                />
              </>
            )}
            {tab === "medications" && (
              <>
                <input
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  placeholder="Medication name"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <input
                  value={mDosage}
                  onChange={(e) => setMDosage(e.target.value)}
                  placeholder="Dosage"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <input
                  value={mFreq}
                  onChange={(e) => setMFreq(e.target.value)}
                  placeholder="Frequency"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <input
                  value={mPrescriber}
                  onChange={(e) => setMPrescriber(e.target.value)}
                  placeholder="Prescriber"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <input
                  value={mStart}
                  onChange={(e) => setMStart(e.target.value)}
                  type="date"
                  placeholder="Start date"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
              </>
            )}
            {tab === "allergies" && (
              <>
                <input
                  value={aAllergen}
                  onChange={(e) => setAAllergen(e.target.value)}
                  placeholder="Allergen"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <select
                  value={aSev}
                  onChange={(e) => setASev(e.target.value as Severity)}
                  style={inp}
                  data-ocid="medicalrecords.select"
                >
                  {(["mild", "moderate", "severe"] as Severity[]).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  value={aNotes}
                  onChange={(e) => setANotes(e.target.value)}
                  placeholder="Notes"
                  style={{ ...inp, gridColumn: "span 2" }}
                  data-ocid="medicalrecords.input"
                />
              </>
            )}
            {tab === "vaccinations" && (
              <>
                <input
                  value={vVaccine}
                  onChange={(e) => setVVaccine(e.target.value)}
                  placeholder="Vaccine name"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <input
                  value={vDate}
                  onChange={(e) => setVDate(e.target.value)}
                  type="date"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <input
                  value={vNext}
                  onChange={(e) => setVNext(e.target.value)}
                  type="date"
                  placeholder="Next due date"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <input
                  value={vProvider}
                  onChange={(e) => setVProvider(e.target.value)}
                  placeholder="Provider"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
              </>
            )}
            {tab === "doctors" && (
              <>
                <input
                  value={dName}
                  onChange={(e) => setDName(e.target.value)}
                  placeholder="Name"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <input
                  value={dSpec}
                  onChange={(e) => setDSpec(e.target.value)}
                  placeholder="Specialty"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <input
                  value={dPhone}
                  onChange={(e) => setDPhone(e.target.value)}
                  placeholder="Phone"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <input
                  value={dAddr}
                  onChange={(e) => setDAddr(e.target.value)}
                  placeholder="Address"
                  style={inp}
                  data-ocid="medicalrecords.input"
                />
                <input
                  value={dNotes}
                  onChange={(e) => setDNotes(e.target.value)}
                  placeholder="Notes"
                  style={{ ...inp, gridColumn: "span 2" }}
                  data-ocid="medicalrecords.input"
                />
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              data-ocid="medicalrecords.confirm_button"
              className="px-4 py-1.5 rounded text-xs font-semibold"
              style={{
                background: "rgba(239,68,68,0.2)",
                border: "1px solid rgba(239,68,68,0.4)",
                color: "rgba(239,120,120,1)",
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              data-ocid="medicalrecords.cancel_button"
              className="px-4 py-1.5 rounded text-xs"
              style={{ color: "var(--os-text-secondary)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {tab === "records" &&
          (data.records.length === 0 ? (
            <div
              className="text-center py-8 text-sm text-muted-foreground/60"
              data-ocid="medicalrecords.empty_state"
            >
              No records yet
            </div>
          ) : (
            data.records.map((r, i) => (
              <div
                key={r.id}
                style={card}
                className="flex items-start gap-3"
                data-ocid={`medicalrecords.item.${i + 1}`}
              >
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0"
                  style={{
                    background: `${RECORD_COLORS[r.type]}22`,
                    color: RECORD_COLORS[r.type],
                  }}
                >
                  {r.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {r.provider}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                      {r.date}
                    </span>
                  </div>
                  {r.notes && (
                    <div className="text-[11px] text-muted-foreground/60 mt-0.5">
                      {r.notes}
                    </div>
                  )}
                  {r.result && (
                    <div
                      className="text-[11px] mt-0.5"
                      style={{ color: "rgba(239,120,120,0.8)" }}
                    >
                      Result: {r.result}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => del("records", r.id)}
                  data-ocid="medicalrecords.delete_button"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500/40 hover:text-red-400" />
                </button>
              </div>
            ))
          ))}
        {tab === "medications" &&
          (data.medications.length === 0 ? (
            <div
              className="text-center py-8 text-sm text-muted-foreground/60"
              data-ocid="medicalrecords.empty_state"
            >
              No medications
            </div>
          ) : (
            data.medications.map((m, i) => (
              <div
                key={m.id}
                style={card}
                className="flex items-start gap-3"
                data-ocid={`medicalrecords.item.${i + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "rgba(239,120,120,1)" }}
                    >
                      {m.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                      {m.dosage}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground/60 mt-0.5">
                    {m.frequency}{" "}
                    {m.prescriber && `· Prescribed by ${m.prescriber}`}{" "}
                    {m.startDate && `· Since ${m.startDate}`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => del("medications", m.id)}
                  data-ocid="medicalrecords.delete_button"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500/40 hover:text-red-400" />
                </button>
              </div>
            ))
          ))}
        {tab === "allergies" &&
          (data.allergies.length === 0 ? (
            <div
              className="text-center py-8 text-sm text-muted-foreground/60"
              data-ocid="medicalrecords.empty_state"
            >
              No allergies recorded
            </div>
          ) : (
            data.allergies.map((a, i) => (
              <div
                key={a.id}
                style={card}
                className="flex items-start gap-3"
                data-ocid={`medicalrecords.item.${i + 1}`}
              >
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0"
                  style={{
                    background: `${SEV_COLORS[a.severity]}22`,
                    color: SEV_COLORS[a.severity],
                  }}
                >
                  {a.severity}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-muted-foreground">
                    {a.allergen}
                  </div>
                  {a.notes && (
                    <div className="text-[11px] text-muted-foreground/60 mt-0.5">
                      {a.notes}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => del("allergies", a.id)}
                  data-ocid="medicalrecords.delete_button"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500/40 hover:text-red-400" />
                </button>
              </div>
            ))
          ))}
        {tab === "vaccinations" &&
          (data.vaccinations.length === 0 ? (
            <div
              className="text-center py-8 text-sm text-muted-foreground/60"
              data-ocid="medicalrecords.empty_state"
            >
              No vaccinations recorded
            </div>
          ) : (
            data.vaccinations.map((v, i) => (
              <div
                key={v.id}
                style={card}
                className="flex items-start gap-3"
                data-ocid={`medicalrecords.item.${i + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {v.vaccine}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                      {v.date}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground/60 mt-0.5">
                    {v.provider && `Provider: ${v.provider}`}{" "}
                    {v.nextDue && `· Next due: ${v.nextDue}`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => del("vaccinations", v.id)}
                  data-ocid="medicalrecords.delete_button"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500/40 hover:text-red-400" />
                </button>
              </div>
            ))
          ))}
        {tab === "doctors" &&
          (data.doctors.length === 0 ? (
            <div
              className="text-center py-8 text-sm text-muted-foreground/60"
              data-ocid="medicalrecords.empty_state"
            >
              No doctors added
            </div>
          ) : (
            data.doctors.map((d, i) => (
              <div
                key={d.id}
                style={card}
                className="flex items-start gap-3"
                data-ocid={`medicalrecords.item.${i + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "rgba(239,120,120,1)" }}
                    >
                      {d.name}
                    </span>
                    {d.specialty && (
                      <span className="text-[10px] text-muted-foreground/60">
                        {d.specialty}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground/60 mt-0.5">
                    {[d.phone, d.address].filter(Boolean).join(" · ")}
                  </div>
                  {d.notes && (
                    <div className="text-[11px] text-muted-foreground/60 mt-0.5">
                      {d.notes}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => del("doctors", d.id)}
                  data-ocid="medicalrecords.delete_button"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500/40 hover:text-red-400" />
                </button>
              </div>
            ))
          ))}
      </div>
    </div>
  );
}
