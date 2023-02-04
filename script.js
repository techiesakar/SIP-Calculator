// For Input
const sipInputField = document.getElementById("sip-input");
const sipInputSlider = document.getElementById("sipSlider");
const rateInputField = document.getElementById("rate-input");
const rateInputSlider = document.getElementById("rateSlider");
const termInputField = document.getElementById("term-input");
const termInputSlider = document.getElementById("termSlider");
const cycleInput = document.getElementById("sip-period");

// Output Elements
const finalBalanceOutput = document.getElementById("finalBalanceOutput");
const investedOutput = document.getElementById("investedOutput");
const totalProfitOutput = document.getElementById("totalProfitOutput");

// Alert Box
const alertBox = document.getElementById("alertBox");
const closeAlert = document.getElementById("closeAlert");
const alertContent = document.getElementById("alertContent");

// Init Values
let sipAmount = 1000;
let prevBalance;
let balance;
let term = 5;
let rate = 10;
let rateToMonth;
let totalInvested;
let monthlyReturn;
let totalProfit;
let cycle = 1;
let time;

// Table

// Creating Objects
let statement = {};

const calculateSIP = () => {
  // Clearing object before calculating new value
  statement = {};

  // Updating Values
  // The first value of balance is SipAmount
  balance = sipAmount;
  // Converting interest rate to month
  rateToMonth = rate / (cycle * 100);
  // Time is total cycle * year
  time = cycle * term;

  totalInvested = 0;

  // Clearing Table
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  const thead = document.querySelector(".thead");
  thead.innerHTML = ` <tr>
  <th scope="col" class="px-6 py-3">SN</th>
  <th scope="col" class="px-6 py-3">SIP Amount</th>
  <th scope="col" class="px-6 py-3">Monthly Return</th>
  <th scope="col" class="px-6 py-3">Balance</th>
</tr>`;

  for (let i = 1; i <= time; i++) {
    prevBalance = balance;
    totalInvested += sipAmount;
    balance =
      sipAmount *
      (((1 + rateToMonth) ** i - 1) / rateToMonth) *
      (1 + rateToMonth);

    monthlyReturn = balance - prevBalance - (i != 1 ? sipAmount : 0);

    const objName = `${i}`;
    statement[objName] = {
      SN: i,
      Amount: sipAmount,
      Return: 0,
      Balance: 0,
    };
    statement[`${i}`].Return = monthlyReturn;
    statement[`${i}`].Balance = balance;
  }

  // To display records on table
  for (const month in statement) {
    const tr = document.createElement("tr");
    tr.classList.add(
      "bg-white",
      "border-b",
      "dark:bg-gray-800",
      "dark:border-gray-700",
      "hover:bg-gray-50",
      "dark:hover:bg-gray-600"
    );

    // For Month
    const monthTd = document.createElement("td");
    monthTd.textContent = month;
    monthTd.classList.add("px-6", "py-4");
    tr.appendChild(monthTd);

    // For SIP Amount
    const sipAmountTD = document.createElement("td");
    sipAmountTD.textContent = statement[month].Amount;
    sipAmountTD.classList.add("px-6", "py-4");
    tr.appendChild(sipAmountTD);

    const returnTD = document.createElement("td");
    returnTD.textContent = statement[month].Return.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    returnTD.classList.add("px-6", "py-4");
    tr.appendChild(returnTD);

    const balanceTD = document.createElement("td");
    balanceTD.textContent = statement[month].Balance.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    balanceTD.classList.add("px-6", "py-4");
    tr.appendChild(balanceTD);

    tableBody.appendChild(tr);
  }
};
// Event listenter for Input Field
let formControl = document.querySelectorAll(".form-control");
let whenInputValueChange = (e) => {
  // First turning off alert box
  alertBox.classList.add("hidden");
  let status = true;
  sipAmount = Number(sipInputField.value);
  sipInputSlider.value = sipAmount;
  rate = Number(rateInputField.value);
  rateInputSlider.value = rate;

  term = Number(termInputField.value);
  termInputSlider.value = term;

  // Exception Check
  if (term > 50) {
    status = false;
    term = 50;
    termInputField.value = 50;
    openAlertBox("Year cannot be more than 50");
  } else {
    status = true;
  }

  if (sipAmount > 50000) {
    status = false;
    sipAmount = 50000;
    sipInputField.value = 50000;
    openAlertBox("SIP amount cannot exceeds 50000");
  } else {
    status = true;
  }

  if (rate > 50) {
    status = false;
    rate = 50;
    rateInputField.value = 50;
    openAlertBox("Interest cannot exceeds 50%");
  } else {
    status = true;
  }

  if (status == true) calculateSIP();
  updateTextContent();
};

formControl.forEach((item) => {
  item.addEventListener("input", whenInputValueChange);
});

// Event listenter for Slider
let sliderControl = document.querySelectorAll(".slider");
let whenSliderValueChange = (e) => {
  // Turning off alert
  alertBox.classList.add("hidden");
  sipInputField.value = sipInputSlider.value;
  sipAmount = Number(sipInputField.value);
  rateInputField.value = rateInputSlider.value;
  rate = Number(rateInputField.value);
  termInputField.value = termInputSlider.value;
  term = Number(termInputField.value);
  calculateSIP();
  updateTextContent();
};

sliderControl.forEach((item) => {
  item.addEventListener("input", whenSliderValueChange);
});

cycleInput.addEventListener("change", (e) => {
  cycle = Number(e.target.value);
  calculateSIP();
  updateTextContent();
});

calculateSIP();

var updateTextContent = () => {
  investedOutput.textContent = totalInvested.toLocaleString("en-us", {
    maximumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  totalProfitOutput.textContent = (balance - totalInvested).toLocaleString(
    "en-us",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
  finalBalanceOutput.textContent = balance.toLocaleString("en-us", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

updateTextContent();
var openAlertBox = (msg) => {
  alertBox.classList.remove("hidden");
  alertContent.textContent = msg;
};
var closeAlertBox = () => {
  closeAlert.addEventListener("click", () => {
    alertBox.classList.add("hidden");
  });
};

closeAlert.addEventListener("click", () => {
  alertBox.classList.add("hidden");
});
