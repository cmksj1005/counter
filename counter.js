document.addEventListener('DOMContentLoaded', () => {
  // Function to run the counter animation

  const startCounter = (counter) => {
    const from = parseFloat(counter.getAttribute('data-from'));
    const to = parseFloat(counter.getAttribute('data-to'));
    const speed = parseInt(counter.getAttribute('data-speed'), 10);
    const addPlus = counter.getAttribute('addPlus')?.toUpperCase() === 'TRUE';
    const addDollar =
      counter.getAttribute('addDollar')?.toUpperCase() === 'TRUE';
    const addMillion =
      counter.getAttribute('addMillion')?.toUpperCase() === 'TRUE';
    const addBillion =
      counter.getAttribute('addBillion')?.toUpperCase() === 'TRUE';

    const range = to - from;

    let current = from;
    let exponent = getDecimalPlaces(to);
    let sign;

    // To check whether the counter has additional sign.
    function checkSign() {
      if (addPlus) sign = '+';
      else if (addDollar && addMillion) sign = '$M';
      else if (addDollar && addBillion) sign = '$B';
      else if (addDollar) sign = '$';
      else if (addMillion) sign = 'M';
      else if (addBillion) sign = 'B';
      else sign = false;
    }

    //To check if the value of 'to' is Decimal number
    function isDecimalNum(dataToValue) {
      const num = parseFloat(dataToValue);
      if (isNaN(num)) {
        return 'Invalid input';
      }
      return !Number.isInteger(num); // Returns true if decimal, false if whole number
    }

    //To check the decimal places
    function getDecimalPlaces(dataToValue) {
      const num = parseFloat(dataToValue);
      if (isNaN(num)) {
        return 'Invalid input';
      }
      const decimalPart = num.toString().split('.')[1];
      return decimalPart ? decimalPart.length : 0;
    }

    //To check if the counter value should be decreased
    const isNegative = () => {
      if (Math.sign(range) == -1) {
        return true;
      } else {
        return false;
      }
    };

    //if addPlus is true, + symbol will be appended at the end of the number when the text is updated
    function updateCounterText(number, sign) {
      const [integerPart, decimalPart] = number.toString().split('.');
      const formattedInteger = new Intl.NumberFormat('en-CA').format(
        integerPart
      );
      const formattedNumber = decimalPart
        ? `${formattedInteger}.${decimalPart}`
        : formattedInteger;

      if (sign == '$M') {
        counter.textContent = '$' + formattedNumber + 'M';
      } else if (sign == '$B') {
        counter.textContent = '$' + formattedNumber + 'B';
      } else if (sign == '$') {
        counter.textContent = sign + formattedNumber;
      } else if (sign == 'M' || sign == 'B' || sign == '+') {
        counter.textContent = formattedNumber + sign;
      } else {
        counter.textContent = formattedNumber;
      }
    }

    //Main method of the counter
    const step = () => {
      checkSign(); // Check whether the counter has additional sign.
      if (Math.sign(range) == 0) {
        updateCounterText(to, sign);
        return;
      }

      let increment;

      increment = (range / speed) * 5;
      incrementWithoutZero = parseInt(
        increment.toString().replace(/0/g, '1'),
        10
      );

      if (isDecimalNum(to)) {
        updateCounterText(current.toFixed(exponent), sign);
      } else {
        updateCounterText(Math.floor(current), sign);
      }

      if (isNegative()) {
        if (increment > -10) {
          current += increment;
        } else {
          current += incrementWithoutZero;
        }
      } else {
        if (increment < 10) {
          current += increment;
        } else {
          current += incrementWithoutZero;
        }
      }

      if (isNegative()) {
        if (current <= to) {
          updateCounterText(to, sign);
        } else {
          setTimeout(step, 1);
        }
      } else {
        if (current >= to) {
          updateCounterText(to, sign);
        } else {
          setTimeout(step, 1);
        }
      }
    };

    step();
  };

  // Function to check if the counter is in the viewport
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  };

  // Function to start the counter when it's visible
  const startCountersOnScroll = () => {
    const counters = document.querySelectorAll('.counter');

    counters.forEach((counter) => {
      // Check if the counter is in the viewport and hasn't started yet
      if (isInViewport(counter) && !counter.classList.contains('started')) {
        startCounter(counter);
        counter.classList.add('started'); // Mark as started to prevent rerun
      }
    });
  };

  // Listen to the scroll event to check visibility of the counters
  window.addEventListener('scroll', startCountersOnScroll);

  // Initial check in case some counters are already in the viewport when the page loads
  startCountersOnScroll();
});
