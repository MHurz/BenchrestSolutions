const clickValue = document.getElementById("clickValue");
const adjustmentType = document.getElementById("adjustmentType");

adjustmentType.addEventListener("change", updateClickOptions);

function updateClickOptions() {
  const type = adjustmentType.value;
  clickValue.innerHTML = "";

  if (type === "moa") {
    clickValue.innerHTML = `
      <option value="0.125">1/8 MOA</option>
      <option value="0.25">1/4 MOA</option>
      <option value="0.5">1/2 MOA</option>
      <option value="1">1 MOA</option>
    `;
  } else if (type === "mil") {
    clickValue.innerHTML = `
      <option value="0.1">0.1 MIL</option>
      <option value="0.2">0.2 MIL</option>
      <option value="0.5">0.5 MIL</option>
    `;
  }
}

function calculate() {
  const poi = parseFloat(document.getElementById("poi").value);
  const distance = parseFloat(document.getElementById("distance").value);
  const clickVal = parseFloat(clickValue.value);
  const type = adjustmentType.value;

  if (isNaN(poi) || isNaN(distance) || isNaN(clickVal)) {
    document.getElementById("result").innerText = "Please fill out all fields.";
    return;
  }

  let shift;
  if (type === "moa") {
    // 1 MOA ≈ 1.047 inches per 100 yards
    shift = (poi / (distance / 100)) / 1.047;
  } else if (type === "mil") {
    // 1 MIL = 3.6 inches per 100 yards
    shift = (poi / (distance / 100)) / 3.6;
  }

  const clicks = shift / clickVal;

  document.getElementById("result").innerText =
    `Approximately ${clicks.toFixed(2)} clicks (${type.toUpperCase()}).`;
}

// Set default values on load
updateClickOptions();

function saveProfile() {
  const name = document.getElementById("profileName").value.trim();
  if (!name) {
    alert("Please enter a profile name.");
    return;
  }

  const type = adjustmentType.value;
  const click = clickValue.value;

  const profiles = JSON.parse(localStorage.getItem("scopeProfiles") || "{}");
  profiles[name] = { type, click };

  localStorage.setItem("scopeProfiles", JSON.stringify(profiles));
  alert(`Profile "${name}" saved!`);
  updateSavedProfiles();

  document.getElementById("profileName").value = "";

  document.getElementById("savedProfiles").value = name;
}

function loadProfile() {
  const selected = document.getElementById("savedProfiles").value;
  const profiles = JSON.parse(localStorage.getItem("scopeProfiles") || "{}");

  if (!selected || !profiles[selected]) {
    alert("Please select a profile to load.");
    return;
  }

  const profile = profiles[selected];
  adjustmentType.value = profile.type;
  updateClickOptions(); // Refresh click values
  clickValue.value = profile.click;

   // ✅ Clear input fields when loading a new profile
  document.getElementById("distance").value = "";
  document.getElementById("poi").value = "";
  document.getElementById("result").textContent = "";

  // ✅ Store this as the last used profile
  localStorage.setItem("lastUsedProfile", selected);

  alert(`Loaded profile: "${selected}"`);
}

function updateSavedProfiles() {
  const savedProfiles = document.getElementById("savedProfiles");
  const profiles = JSON.parse(localStorage.getItem("scopeProfiles") || "{}");

  savedProfiles.innerHTML = "";

  for (const name in profiles) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.text = name;
    savedProfiles.appendChild(opt);
  }
}

function deleteProfile() {
  const selected = document.getElementById("savedProfiles").value;
  if (!selected) {
    alert("Please select a profile to delete.");
    return;
  }

  const confirmDelete = confirm(`Are you sure you want to delete the profile "${selected}"?`);
  if (!confirmDelete) return;

  const profiles = JSON.parse(localStorage.getItem("scopeProfiles") || "{}");

  if (profiles[selected]) {
    delete profiles[selected];
    localStorage.setItem("scopeProfiles", JSON.stringify(profiles));
    alert(`Profile "${selected}" deleted.`);
    updateSavedProfiles();
  } else {
    alert("Profile not found.");
  }
}


// Call this when page loads
updateSavedProfiles();

// 🔄 Auto-load profile when selected from dropdown
document.getElementById("savedProfiles").addEventListener("change", function () {
  loadProfile();
});
