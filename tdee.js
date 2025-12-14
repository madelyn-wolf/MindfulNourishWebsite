document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tdee-form");
  const unitsSel = document.getElementById("units");
  const metricBox = document.getElementById("metric-fields");
  const usBox = document.getElementById("us-fields");
  const out = document.getElementById("tdee-output");


const heightSelect = document.getElementById("height-select");

function populateHeights() {
  heightSelect.innerHTML = '<option value="">Select height</option>';

  let heights = [];

  for (let feet = 4; feet <= 6; feet++) {
    for (let inch = 0; inch <= 11; inch++) {
      if ((feet === 4 && inch < 9) || (feet === 6 && inch > 11)) {
        continue; 
      }
      const totalInches = feet * 12 + inch;
      const label = `${feet}'${inch}"`;
      heights.push({ label, value: totalInches });
    }
  }

  heights.forEach(h => {
    const opt = document.createElement("option");
    opt.value = h.value;
    opt.textContent = h.label;
    heightSelect.appendChild(opt);
  });
}

populateHeights();

  out.innerHTML = `
    <div class="mn-results">
      <h3>Your Results</h3>
      <p>Enter your details and click <strong>Calculate TDEE</strong> to view your estimated daily calorie needs.</p>
      <small>All values are estimates and should be adjusted based on your progress.</small>
    </div>
  `;

  //metric / US fields
  unitsSel.addEventListener("change", () => {
    const isMetric = unitsSel.value === "metric";
    metricBox.style.display = isMetric ? "grid" : "none";
    usBox.style.display = isMetric ? "none" : "grid";
    // Keep placeholder visible
    out.innerHTML = `
      <div class="mn-results">
        <h3>Your Results</h3>
        <p>Enter your details and click <strong>Calculate TDEE</strong> to view your estimated daily calorie needs.</p>
        <small>All values are estimates and should be adjusted based on your progress.</small>
      </div>
    `;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const sex = form.querySelector('input[name="sex"]:checked').value;
    const age = Number(document.getElementById("age").value);
    const activity = Number(document.getElementById("activity").value);

    let weightKg, heightCm;
    if (unitsSel.value === "metric") {
      weightKg = Number(document.getElementById("weight-kg").value);
      heightCm = Number(document.getElementById("height-cm").value);
    } else {
      const weightLb = Number(document.getElementById("weight-lb").value);
      const heightIn = Number(heightSelect.value);
        weightKg = weightLb * 0.45359237;
        heightCm = heightIn * 2.54;
    }
    if (unitsSel.value === "us" && !heightSelect.value) {
      out.innerHTML = `<p>Please select a height.</p>`;
      return;
    }

    // BMR (Mifflin–St Jeor)
    const bmr =
      sex === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    const tdee = bmr * activity;

    // Cutting options (fixed deficits)
    const cut250 = Math.max(0, Math.round(tdee - 250));
    const cut500 = Math.max(0, Math.round(tdee - 500));
    const cut750 = Math.max(0, Math.round(tdee - 750));
    const gainRange = `${Math.round(tdee * 1.1)} – ${Math.round(tdee * 1.2)}`;

    out.innerHTML = `
      <div class="mn-results">
        <h3>Your Results</h3>
        <p><strong>BMR:</strong> ${Math.round(bmr)} kcal/day</p>
        <p><strong>Maintenance (TDEE):</strong> ${Math.round(tdee)} kcal/day</p>
        <hr>
        <p><strong>Cutting options:</strong></p>
        <ul style="margin:.4rem 0 .8rem 1.2rem;">
          <li>−250 kcal: <strong>${cut250}</strong> kcal/day</li>
          <li>−500 kcal: <strong>${cut500}</strong> kcal/day</li>
          <li>−750 kcal: <strong>${cut750}</strong> kcal/day</li>
        </ul>
        <p><strong>Bulking range:</strong> ${gainRange} kcal/day</p>
        <small>These are estimates. Reassess every 2–3 weeks based on progress.</small>
      </div>
    `;
  });
});
