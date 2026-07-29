// 🔴 আপনার গুগল অ্যাপস স্ক্রিপ্টের Web App URL লিঙ্কটি এখানে বসান 🔴
const scriptURL = 'https://script.google.com/macros/s/AKfycbyEboiatmeXyuyUEWNv1zi_q23zXvEt_7Jb3TMNogsdag7nAV1hxE77lW5t8kPTNVyCyA/exec';

function onReasonChange() {
  updateAmount();
  updateDynamicFields();
}

function onMethodChange() {
  var paymentOption = document.getElementById("payment_option").value;
  var receiptDetails = document.getElementById("receipt-details");
  var instruction = document.getElementById("method-instruction");

  if (paymentOption !== "") {
    receiptDetails.style.display = "block";
    
    var selectedText = "";
    if(paymentOption === "bkash") selectedText = "বিকাশ (01410892693)";
    else if(paymentOption === "nagad") selectedText = "নগদ (01410892693)";
    else if(paymentOption === "rocket") selectedText = "রকেট (01410892693)";

    instruction.innerText = "আমাদের " + selectedText + " নম্বরে টাকা সেন্ড মানি করে নিচের তথ্যগুলো পূরণ করুন:";
    
    // ডাইনামিক রিকোয়ার্ড
    document.getElementById("sender_number").required = true;
    document.getElementById("trx_id").required = true;
    document.getElementById("amount").required = true;

    updateAmount();
    updateDynamicFields();
  } else {
    receiptDetails.style.display = "none";
    document.getElementById("sender_number").required = false;
    document.getElementById("trx_id").required = false;
    document.getElementById("amount").required = false;
  }
}
// টাকা অটোমেটিক সাজানোর ফাংশন
function updateAmount() {
  var reasonSelect = document.getElementById("payment_reason");
  var selectedOption = reasonSelect.options[reasonSelect.selectedIndex];
  
  var baseBox = document.getElementById("base-amount-box");
  var baseText = document.getElementById("base-amount-text");
  var plusSign = baseBox.querySelector(".plus-sign");
  var extraInput = document.getElementById("extra_amount");

  if (selectedOption && selectedOption.dataset.amount) {
    var val = selectedOption.value;
    var baseAmount = selectedOption.dataset.amount;

    // সোশ্যাল মিডিয়া ফিক্স বা আদার্স সিলেক্ট করলে "500 +" এবং অতিরিক্ত ইনপুট বক্স দেখাবে
    if (val === "social_fix" || val === "others") {
      baseText.innerText = baseAmount;
      baseBox.style.display = "flex";
      plusSign.style.display = "inline"; // + চিহ্ন দেখাবে
      extraInput.style.display = "block"; // অতিরিক্ত ইনপুট ফিল্ড দেখাবে
      extraInput.placeholder = "অতিরিক্ত টাকা (যদি থাকে)";
      extraInput.value = ""; // ফিল্ড খালি রাখা হলো
    } else {
      // সার্টিফিকেট ফি এর ক্ষেত্রে কোন প্লাস বা এক্সট্রা ইনপুট থাকবে না
      baseText.innerText = baseAmount;
      baseBox.style.display = "flex"; 
      plusSign.style.display = "none"; // + চিহ্ন হাইড থাকবে
      extraInput.style.display = "none"; // ইনপুট বক্স হাইড থাকবে
    }
  } else {
    baseBox.style.display = "none";
  }

  calculateTotalAmount();
}

// গুগল শিটে পাঠানোর জন্য টাকার ফর্ম্যাট তৈরি (যেমন: 500 + 200)
function calculateTotalAmount() {
  var reasonSelect = document.getElementById("payment_reason");
  var selectedOption = reasonSelect.options[reasonSelect.selectedIndex];
  var baseAmount = (selectedOption && selectedOption.dataset.amount) ? selectedOption.dataset.amount : "";
  var extraAmount = document.getElementById("extra_amount").value.trim();

  var finalAmountString = "";

  if (baseAmount) {
    // স্টুডেন্ট যদি অতিরিক্ত টাকা টাইপ করে (যেমন: 200)
    if (extraAmount !== "" && extraAmount !== "0") {
      finalAmountString = baseAmount + " + " + extraAmount;
    } else {
      // অতিরিক্ত কিছু না লিখলে শুধু বেস টাকা (যেমন: 500)
      finalAmountString = baseAmount;
    }
  }

  // শিটে পাঠানোর জন্য হিডেন ইনপুট ফিল্ডে '500 + 200' ফরম্যাট সেট করা
  document.getElementById("amount").value = finalAmountString;
  
  // স্ক্রিনে ইউজারকে মোট টাকা বা লেখার ফর্ম্যাটটি দেখানো
  document.getElementById("total-val").innerText = finalAmountString || "0";
}
    // সোশ্যাল মিডিয়া প্রবলেম ফিক্স বা আদার্স হলে প্লাস চিহ্ন দেখাবে এবং টাইপ করার সুযোগ দিবে
    if (val === "social_fix" || val === "others") {
      amountInput.value = baseAmount;
      amountInput.readOnly = false; // ইউজার এডিট/টাইপ করতে পারবে
      plusIcon.style.display = "inline"; // প্লাস চিহ্ন দেখাবে
    } else {
      amountInput.value = baseAmount;
      amountInput.readOnly = true; // নির্দিষ্ট ফি হলে চেঞ্জ করা যাবে না
      plusIcon.style.display = "none"; // প্লাস চিহ্ন হাইড থাকবে
    }
  } else {
    amountInput.value = "";
    amountInput.readOnly = false;
    plusIcon.style.display = "none";
  }
}

// গুগল শিটে ডাটা পাঠানো ও পপ-আপ প্রসেস
function handleFormSubmit(event) {
  event.preventDefault(); 
  var submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.innerText = "প্রসেসিং হচ্ছে...";

  var form = document.forms['google-sheet'];

  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
      submitBtn.disabled = false;
      submitBtn.innerText = "পেমেন্ট সাবমিট করুন";
      
      var modal = document.getElementById("popupModal");
      if (modal) {
        modal.style.display = "flex";
      }
    })
    .catch(error => {
      submitBtn.disabled = false;
      submitBtn.innerText = "পেমেন্ট সাবমিট করুন";
      alert('সমস্যা হয়েছে! অনুগ্রহ করে আবার চেষ্টা করুন।');
      console.error('Error!', error.message);
    });
}

// রিফ্রেশ ও রিসেট ফাংশন
function resetAndRefresh() {
  location.reload(); 
}
