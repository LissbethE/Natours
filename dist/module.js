/* eslint-disable */ const $91fc4afabd57800f$var$stripe = Stripe("pk_test_51NtJp2CMwuOVAK0FcnNQDqAUp7fWcavbJ4PqjbKAz0zSpOor2gZMDHprNOEy4TQRURR6QC5M2pTxRq5Grl6h1cRO00X1cCDvVs");
///////////////////////////////////
// DOM ElEMENTS
const $91fc4afabd57800f$var$loginForm = document.querySelector(".form--login");
const $91fc4afabd57800f$var$signupForm = document.querySelector(".form--signup");
const $91fc4afabd57800f$var$logOutBtn = document.querySelector(".nav__el--logout");
const $91fc4afabd57800f$var$userDataForm = document.querySelector(".form-user-data");
const $91fc4afabd57800f$var$userPasswordForm = document.querySelector(".form-user-password");
const $91fc4afabd57800f$var$bookBtn = document.getElementById("book-tour");
const $91fc4afabd57800f$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
};
const $91fc4afabd57800f$export$de026b00723010c1 = (type, message)=>{
    $91fc4afabd57800f$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${message}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout($91fc4afabd57800f$export$516836c6a9dfc573, 5000);
};
///////////////////////////////////
// Login And Logout
const $91fc4afabd57800f$var$login = async function(email, password) {
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/login",
            data: {
                email: email,
                password: password
            }
        });
        if (res.data.status === "success") {
            $91fc4afabd57800f$export$de026b00723010c1("success", "Logged in successfully! \uD83C\uDF89");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        $91fc4afabd57800f$export$de026b00723010c1("error", `${err.response.data.message}💥`);
    }
};
const $91fc4afabd57800f$var$singnup = async function(name, email, password, passwordConfirm) {
    try {
        // Date object
        const date = new Date();
        let currentDay = String(date.getDate()).padStart(2, "0");
        let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
        let currentYear = date.getFullYear();
        // we will display the date as DD-MM-YYYY
        let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/singnup",
            data: {
                name: name,
                email: email,
                password: password,
                passwordConfirm: passwordConfirm,
                rol: "user",
                passwordChangedAt: Number(currentDate)
            }
        });
        if (res.data.status === "success") {
            $91fc4afabd57800f$export$de026b00723010c1("success", "Logged in successfully! \uD83C\uDF89");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        $91fc4afabd57800f$export$de026b00723010c1("error", `${err.response.data.message}💥`);
    }
};
const $91fc4afabd57800f$var$logout = async ()=>{
    try {
        const res = await axios({
            method: "GET",
            url: "/api/v1/users/logout"
        });
        if (res.data.status === "success") location.reload(true);
    } catch (err) {
        $91fc4afabd57800f$export$de026b00723010c1("error", `💥Error logging out! 🔁Try again.`);
    }
};
///////////////////////////////////
// Update Settings
// type is either "password" or "date"
const $91fc4afabd57800f$var$updateSettings = async function(data, type) {
    try {
        const url = type === "password" ? "/api/v1/users/updateMyPassword" : "/api/v1/users/updateMe";
        const res = await axios({
            method: "patch",
            url: url,
            data: data
        });
        if (res.data.status === "success") $91fc4afabd57800f$export$de026b00723010c1("success", `${type} updated successfully! 🎉`);
    } catch (err) {
        $91fc4afabd57800f$export$de026b00723010c1("error", err.response.data.message);
    }
};
const $91fc4afabd57800f$export$8d5bdbf26681c0c2 = async function(tourId) {
    try {
        // 1) Get checkout session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        // 2) Create checkout form + chance credit card
        await $91fc4afabd57800f$var$stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        $91fc4afabd57800f$export$de026b00723010c1("error", `${err.response.data.message}💥`);
    }
};
///////////////////////////////////
///////////////////////////////////
if ($91fc4afabd57800f$var$loginForm) $91fc4afabd57800f$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    $91fc4afabd57800f$var$login(email, password);
});
if ($91fc4afabd57800f$var$signupForm) $91fc4afabd57800f$var$signupForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    $91fc4afabd57800f$var$singnup(name, email, password, passwordConfirm);
});
if ($91fc4afabd57800f$var$logOutBtn) $91fc4afabd57800f$var$logOutBtn.addEventListener("click", $91fc4afabd57800f$var$logout);
// Update Settings ----
if ($91fc4afabd57800f$var$userDataForm) $91fc4afabd57800f$var$userDataForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    $91fc4afabd57800f$var$updateSettings(form, "data");
});
if ($91fc4afabd57800f$var$userPasswordForm) $91fc4afabd57800f$var$userPasswordForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await $91fc4afabd57800f$var$updateSettings({
        passwordCurrent: passwordCurrent,
        password: password,
        passwordConfirm: passwordConfirm
    }, "password");
    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
});
// Stripe ----
if ($91fc4afabd57800f$var$bookBtn) $91fc4afabd57800f$var$bookBtn.addEventListener("click", function(e) {
    e.target.textContent = "Processing...";
    const { tourId: tourId } = e.target.dataset;
    $91fc4afabd57800f$export$8d5bdbf26681c0c2(tourId);
});


export {$91fc4afabd57800f$export$516836c6a9dfc573 as hideAlert, $91fc4afabd57800f$export$de026b00723010c1 as showAlert, $91fc4afabd57800f$export$8d5bdbf26681c0c2 as bookTour};
//# sourceMappingURL=module.js.map
