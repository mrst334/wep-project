// إنشاء حساب جديد
function registerUser(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // حفظ الاسم مؤقتًا في LocalStorage
      localStorage.setItem("displayName", name);

      // إرسال رسالة تحقق
      user.sendEmailVerification()
        .then(() => {
          showModal("تم إرسال رسالة تحقق إلى بريدك. يرجى التحقق أولاً.");
        });
    })
    .catch((error) => {
      showModal(error.message);
    });
}

// تسجيل دخول المستخدم
function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (user.emailVerified) {
        // حفظ الاسم في LocalStorage
        localStorage.setItem("loggedUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
      } else {
        showModal("يرجى التحقق من بريدك الإلكتروني قبل تسجيل الدخول.");
      }
    })
    .catch((error) => {
      showModal(error.message);
    });
}

// عرض اسم المستخدم داخل الداشبورد
function showUserName() {
  const user = firebase.auth().currentUser;

  if (user && user.displayName) {
    document.getElementById("welcome").innerText = "مرحبًا، " + user.displayName;
  } else {
    const name = localStorage.getItem("displayName");
    if (name) {
      document.getElementById("welcome").innerText = "مرحبًا، " + name;
    }
  }
}

// مودال التنبيهات
function showModal(message) {
  document.getElementById("modalText").innerText = message;
  document.getElementById("customModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("customModal").style.display = "none";
}
