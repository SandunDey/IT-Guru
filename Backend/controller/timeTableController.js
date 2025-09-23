import Timetable from "../model/timetable.js";

export async function createTimetable(req, res) {
  try {
    const timetable = new Timetable(req.body);
    await timetable.save();
    return res.status(201).json({ message: " Timetable created", timetable });
  } catch (err) {
    console.error("Create timetable error:", err);
    return res.status(500).json({ message: " Failed to create timetable", error: err.message });
  }
}

export async function getAllTimetable(_req, res) { 
  try {
    const timetables = await Timetable.find().sort({ date: 1, startTime: 1 });
    return res.json(timetables);                                         
  } catch (err) {
    return res.status(500).json({ message: " Failed to fetch timetables", error: err.message });
  }
}

export async function getTimetableById(req, res) {
  try {
    const timetable = await Timetable.findOne({ timetableID: req.params.timetableID }); // ✅ lowercase
    if (!timetable) return res.status(404).json({ message: "Not found" });
    return res.json(timetable);
  } catch (err) {
    return res.status(500).json({ message: " Error fetching timetable", error: err.message });
  }
}

export async function updateTimetable(req, res) {
  try {
    const body = { ...req.body };//...req.body eken copy ekak gnnw update krnna ena data set eke
    delete body.timetableID;  //ID eka delete krnw ,ID ek update krnn bari wenna,ituru data change krnw

    const updated = await Timetable.findOneAndUpdate(
       { timetableID: req.params.timetableID },//Looks for a timetable with the given TimetableID
      body,//update with new data
      { new: true }//return updated record
    );
    if (!updated) return res.status(404).json({ message: "Not found" });//if no timetable with that id
    return res.json({ message: "Timetable updated", updated });
  } catch (err) {
    console.error("Update timetable error:", err);
    return res.status(500).json({ message: " Error updating timetable", error: err.message });
  }
}

export async function deleteTimetable(req, res) {
  try {
    const deleted = await Timetable.findOneAndDelete({ timetableID: req.params.timetableID });//req eke ena ID ekt smana ID ekak tiyd balala ek delete krnw,sotre in 'deleted
    if (!deleted) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "🗑️ Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: " Error deleting timetable", error: err.message });
  }
}
