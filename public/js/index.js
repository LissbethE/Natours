/* eslint-disable */

const stripe = Stripe(
  'pk_test_51NtJp2CMwuOVAK0FcnNQDqAUp7fWcavbJ4PqjbKAz0zSpOor2gZMDHprNOEy4TQRURR6QC5M2pTxRq5Grl6h1cRO00X1cCDvVs',
);

///////////////////////////////////
// DOM ElEMENTS

const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

///////////////////////////////////
// A L E R T

export const hideAlert = () => {
  const el = document.querySelector('.alert');

  if (el) el.parentElement.removeChild(el);
};

// Type is "Success" or "Error"
export const showAlert = (type, message) => {
  console.log('Alert');

  hideAlert();

  const markup = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 5000);
};

///////////////////////////////////
// Login And Logout

const login = async function (email, password) {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully! 🎉');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', `${err.response.data.message}💥`);
  }
};

const singnup = async function (name, email, password, passwordConfirm) {
  try {
    // Date object
    const date = new Date();
    let currentDay = String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth() + 1).padStart(2, '0');
    let currentYear = date.getFullYear();

    // we will display the date as DD-MM-YYYY
    let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;

    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/singnup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
        rol: 'user',
        passwordChangedAt: Number(currentDate),
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully! 🎉');

      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', `${err.response.data.message}💥`);
    console.log(err);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', `💥Error logging out! 🔁Try again.`);
  }
};

///////////////////////////////////
// Update Settings

// type is either "password" or "date"
const updateSettings = async function (data, type) {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'patch',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type} updated successfully! 🎉`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

///////////////////////////////////
// Stripe

export const bookTour = async function (tourId) {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );

    // 2) Create checkout form + chance credit card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    console.log(err);
  }
};

///////////////////////////////////
///////////////////////////////////
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    singnup(name, email, password, passwordConfirm);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

// Update Settings ----
if (userDataForm) {
  userDataForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

// Stripe ----
if (bookBtn) {
  bookBtn.addEventListener('click', function (e) {
    e.target.textContent = 'Processing...';

    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
