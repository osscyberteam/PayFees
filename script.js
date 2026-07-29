// 🔴 আপনার গুগল অ্যাপস স্ক্রিপ্টের Web App URL লিঙ্ক 🔴
const scriptURL = 'https://script.google.com/macros/s/AKfycbyEboiatmeXyuyUEWNv1zi_q23zXvEt_7Jb3TMNogsdag7nAV1hxE77lW5t8kPTNVyCyA/exec';

// ১. কারণ পরিবর্তনের ইভেন্ট
function onReasonChange() {
  updateAmount();
  updateDynamicFields();
}

// ২. পেমেন্ট মেথড (বিকাশ/নগদ/রকেট) পরিবর্তনের ইভেন্ট
function onMethodChange() {
  var paymentOption = document.getElementById("payment_option").value;
  var receiptDetails = document.getElementById("receipt-details");
  var instruction = document.getElementById("method-instruction");

  if (paymentOption !== "") {
    receiptDetails.style.display = "block";
    
    var selectedText = "";
    if (paymentOption === "bkash") selectedText = "বিকাশ (01410892693)";
    else if (paymentOption === "nagad") selectedText = "নগদ (01410892693)";
    else if (paymentOption === "rocket") selectedText = "রকেট (01410892693)";

    instruction.innerText = "আমাদের " + selectedText + " নম্বরে টাকা সেন্ড মানি করে নিচের তথ্যগুলো পূরণ করুন:";
    
    // ডাইনামিক রিকোয়ার্ড ফিল্ড সেট করা
    var sender = document.getElementById("sender_number");
    var trx = document.getElementById("trx_id");
    var amt = document.getElementById("amount");

    if(sender) sender.required = true;
    if(trx) trx.required = true;
    if(amt) amt.required = true;

    updateAmount();
    updateDynamicFields();
  } else {
    receiptDetails.style.display = "none";
    var sender = document.getElementById("sender_number");
    var trx = document.getElementById("trx_id");
    var amt = document.getElementById("amount");

    if(sender) sender.required = false;
    if(trx) trx.required = false;
    if(amt) amt.required = false;
  }
}

// ৩. ডাইনামিক ফিল্ড (সার্টিফিকেট/প্রবলেম) হাইড ও শো করার ফাংশন
function updateDynamicFields() {
  var reasonSelect = document.getElementById("payment_reason") ? document.getElementById("payment_reason").value : "";
  var paymentOption = document.getElementById("payment_option") ? document.getElementById("payment_option").value : "";
  
  var certFields = document.getElementById("cert-fields");
  var problemFields = document.getElementById("problem-fields");

  var userName = document.getElementById("user_name");
  var userPhone = document.getElementById("user_phone");
  var userAddress = document.getElementById("user_address");
  var problemDetails = document.getElementById("problem_details");

  if (paymentOption !== "" && reasonSelect !== "") {
    if (reasonSelect === "certificate" || reasonSelect === "renew_certificate") {
      if(certFields) certFields.style.display = "block";
      if(problemFields) problemFields.style.display = "none";
      
      if(userName) userName.required = true;
      if(userPhone) userPhone.required = true;
      if(userAddress) userAddress.required = true;
      if(problemDetails) problemDetails.required = false;
    } else {
      if(certFields) certFields.style.display = "none";
      if(problemFields) problemFields.style.display = "block";

      if(userName) userName.required = false;
      if(userPhone) userPhone.required = false;
      if(userAddress) userAddress.required = false;
      if(problemDetails) problemDetails.required = true;
    }
  } else {
    if(certFields) certFields.style.display = "none";
    if(problemFields) problemFields.style.display = "none";
    
    if(userName) userName.required = false;
    if(userPhone) userPhone.required = false;
    if(userAddress) userAddress.required = false;
    if(problemDetails) problemDetails.required = false;
  }
}

// ৪. টাকা অটোমেটিক ও প্লাস চিহ্ন সাজানোর ফাংশন
function updateAmount() {
  var reasonSelect = document.getElementById("payment_reason");
  var selectedOption = reasonSelect ? reasonSelect.options[reasonSelect.selectedIndex] : null;
  
  var baseBox = document.getElementById("base-amount-box");
  var baseText = document.getElementById("base-amount-text");
  var plusSign = baseBox ? baseBox.querySelector(".plus-sign") : null;
  var extraInput = document.getElementById("extra_amount");

  if (selectedOption && selectedOption.dataset.amount !== undefined) {
    var val = selectedOption.value;
    var baseAmount = selectedOption.dataset.amount;

    // সোশ্যাল মিডিয়া ফিক্স বা আদার্স সিলেক্ট করলে "143 +" এবং অতিরিক্ত ইনপুট বক্স দেখাবে
    if (val === "social_fix" || val === "others") {
      if(baseText) baseText.innerText = baseAmount;
      if(baseBox) baseBox.style.display = "flex";
      if(plusSign) plusSign.style.display = "inline";
      if(extraInput) {
        extraInput.style.display = "block";
        extraInput.placeholder = "অতিরিক্ত টাকা (যদি থাকে)";
      }
    } else {
      // সার্টিফিকেট ফি এর ক্ষেত্রে কোন প্লাস বা এক্সট্রা ইনপুট থাকবে না
      if(baseText) baseText.innerText = baseAmount;
      if(baseBox) baseBox.style.display = "flex"; 
      if(plusSign) plusSign.style.display = "none";
      if(extraInput) {
        extraInput.style.display = "none";
        extraInput.value = "";
      }
    }
  } else {
    if(baseBox) baseBox.style.display = "none";
    if(extraInput) extraInput.style.display = "none";
  }

  calculateTotalAmount();
}

// ৫. গুগল শিটে পাঠানোর জন্য টাকার ফর্ম্যাট তৈরি (যেমন: 143 + 200)
function calculateTotalAmount() {
  var reasonSelect = document.getElementById("payment_reason");
  var selectedOption = reasonSelect ? reasonSelect.options[reasonSelect.selectedIndex] : null;
  var baseAmount = (selectedOption && selectedOption.dataset.amount !== undefined) ? selectedOption.dataset.amount : "";
  
  var extraInput = document.getElementById("extra_amount");
  var extraAmount = extraInput ? extraInput.value.trim() : "";

  var finalAmountString = "";

  if (baseAmount !== "") {
    var val = selectedOption ? selectedOption.value : "";
    
    // সোশ্যাল মিডিয়া ফিক্স বা আদার্স হলে এবং এক্সট্রা কিছু টাইপ করলে '143 + 200' ফরম্যাট হবে
    if ((val === "social_fix" || val === "others") && extraAmount !== "" && extraAmount !== "0") {
      finalAmountString = baseAmount + " + " + extraAmount;
    } else {
      finalAmountString = baseAmount;
    }
  }

  // গুগল শিটে পাঠানোর জন্য হিডেন ইনপুট ফিল্ডে ভ্যালু সেট করা
  var hiddenAmountInput = document.getElementById("amount");
  if(hiddenAmountInput) hiddenAmountInput.value = finalAmountString;
  
  // স্ক্রিনে ইউজারকে মোট পেমেন্ট প্রিভিউ দেখানোর জন্য
  var totalValSpan = document.getElementById("total-val");
  if(totalValSpan) totalValSpan.innerText = finalAmountString || "0";
}

// ৬. গুগল শিটে ডাটা পাঠানো ও পপ-আপ প্রসেস
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
      alert('সমস্যা হয়েছে! অনুগ্রহ করে আবার চেষ্টা করুন।');
      console.error('Error!', error.message);
    });
}

// ৭. রিফ্রেশ ও রিসেট ফাংশন
function resetAndRefresh() {
  location.reload(); 
}
