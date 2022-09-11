/* Calendar */
/* Weeks information */
function getWeekNumber(date) {
    const firstDayOfTheYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfTheYear) / 86400000;
    
    return Math.ceil((pastDaysOfYear + firstDayOfTheYear.getDay() + 1) / 7)
  }
  
  function isLeapYear(year) {
    // If is a leap year this is the formula to get it:
    return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
  }
  
  /* Days Information */
  class Day {
    constructor(date = null, lang = 'default') {
      date = date ?? new Date();
      
        //PROPERTIES
      this.Date = date;
      this.date = date.getDate();
      this.day = date.toLocaleString(lang, { weekday: 'long'});
      this.dayNumber = date.getDay() + 1;
      this.dayShort = date.toLocaleString(lang, { weekday: 'short'});
      this.year = date.getFullYear();
      this.yearShort = date.toLocaleString(lang, { year: '2-digit'});
      this.month = date.toLocaleString(lang, { month: 'long'});
      this.monthShort = date.toLocaleString(lang, { month: 'short'});
      this.monthNumber = date.getMonth() + 1;
      this.timestamp = date.getTime();
      this.week = getWeekNumber(date);
    }
    
    get isToday() { /* this getter is going to return today's date result */
      return this.isEqualTo(new Date());
    }
    
    isEqualTo(date) { /* code for getting today's date */
      date = date instanceof Day ? date.Date : date;
      /* This return is going to get the date, then the month number and then the full year */
      
      return date.getDate() === this.date &&
        date.getMonth() === this.monthNumber - 1 &&
        date.getFullYear() === this.year;
    }
    
    format(formatStr) { /* code for format date string into any form we would like */
      return formatStr// Is going to return a string 
        .replace(/\bYYYY\b/, this.year) //YYYY represents the whole year number
        .replace(/\bYYY\b/, this.yearShort) //YYYY represents the whole year number
        .replace(/\bWW\b/, this.week.toString().padStart(2, '0')) // WWW means the week number where the current day 
        .replace(/\bW\b/, this.week) // W stands for week as short version
        .replace(/\bDDDD\b/, this.day) //DDDD stands for day as a long version
        .replace(/\bDDD\b/, this.dayShort) //DDD stands for day as a short version
        .replace(/\bDD\b/, this.date.toString().padStart(2, '0')) // DD means the current day number as a short version
        .replace(/\bD\b/, this.date)//D stands for day as a short version, and this is linked with date instead of day to show another possible way to represent it.

        //for months are pretty uch the same, just by changing the values to M:
        .replace(/\bMMMM\b/, this.month) //MMMM stands for month as a long version
        .replace(/\bMMM\b/, this.monthShort) //MMM stands for month  as a short version
        .replace(/\bMM\b/, this.monthNumber.toString().padStart(2, '0')) // MM means the current month  number as a short version
        .replace(/\bM\b/, this.monthNumber) //M stands for month  as a short version, and this is linked with monthNumber instead of month to show another possible way to represent it.

    }
  }
  
  class Month {
    constructor(date = null, lang = 'default') {
      const day = new Day(date, lang);
      const monthsSize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      // this array represents the size of each month from the year. How many day got each of the 12 months
      this.lang = lang;
      
      this.name = day.month;
      this.number = day.monthNumber;
      this.year = day.year;
      this.numberOfDays = monthsSize[this.number - 1]; // Is going to be minus one day, so it can match the index of the monthsSize array

      
      if(this.number === 2) {
        this.numberOfDays += isLeapYear(day.year) ? 1 : 0;
      }
      
      this[Symbol.iterator] = function* () {
        let number = 1; // this number represents the day of the month
        yield this.getDay(number);
        while(number < this.numberOfDays) {// while the number is less than the number of days
          ++number;
          yield this.getDay(number);
        }
      }
    }
    
    getDay(date) { // gets the date of the day that you select
      return new Day(new Date(this.year, this.number - 1, date), this.lang);
    }
  }
  
  class Calendar {
    weekDays = Array.from({length: 7}); // I'm setting an array of 7 days of the week
    
    constructor(year = null, monthNumber = null, lang = 'default') {
      this.today = new Day(null, lang); //new day in the calendar
      this.year = year ?? this.today.year;// we are using year or today's year
      this.month = new Month(new Date(this.year, (monthNumber || this.today.monthNumber) - 1), lang);// we need to substract because is not zero based
      this.lang = lang;
      
      this[Symbol.iterator] = function* () {
        let number = 1;// this number represents the day of the month
        yield this.getMonth(number);
        while(number < 12) {// while the number is less than the number of months that are 12
          ++number;
          yield this.getMonth(number);
        }
      }
      
      this.weekDays.forEach((_, i) => {// for each week day I get a day
        const day = this.month.getDay(i + 1);
        if(!this.weekDays.includes(day.day)) {
          this.weekDays[day.dayNumber - 1] = day.day
        }
        //if the weekday does not include today then use the dy number - 1 to save it as an index, so it means that the days are ordered correctly
      })
    }
    
    get isLeapYear() { //code if is a leap year
      return isLeapYear(this.year);
    }
    
    getMonth(monthNumber) {// get month returns new month
      return new Month(new Date(this.year, monthNumber - 1), this.lang);
    }
    //Adding Methods to get previous and next months
    getPreviousMonth() {
      if(this.month.number === 1) {
        return new Month(new Date(this.year - 1, 11), this.lang);
         // if current number is January we will go to december of previous year
      }
      
      return new Month(new Date(this.year, this.month.number - 2), this.lang);// we substract 2, one to make it zero based and the other one to grab the month
    }
    
    getNextMonth() {
      if(this.month.number === 12) {// if this month is January
        return new Month(new Date(this.year + 1, 0), this.lang);
      }
      
      return new Month(new Date(this.year, this.month.number + 2), this.lang);// we sum up 2, one to make it zero based and the other one to grab the month
    }
    
    //This method takes us to a specific day
    goToDate(monthNumber, year) {
      this.month = new Month(new Date(year, monthNumber - 1), this.lang);
      this.year = year;
    }
    
    goToNextYear() {
      this.year += 1;//We start from January
      this.month = new Month(new Date(this.year, 0), this.lang);
    }
    
    goToPreviousYear() {
      this.year -= 1;// We start from December
      this.month = new Month(new Date(this.year, 11), this.lang);
    }
    
    goToNextMonth() {// no returning function
      if(this.month.number === 12) {// if this month is December
        return this.goToNextYear();
      }
      
      this.month = new Month(new Date(this.year, (this.month.number + 1) - 1), this.lang);// if current number is December we will go to January of next year
    }
    
    goToPreviousMonth() {// no returning function
      if(this.month.number === 1) {// if this month is January
        return this.goToPreviousYear();
      }
      
      this.month = new Month(new Date(this.year, (this.month.number - 1) - 1), this.lang); // if current number is January we will go to December of the past year
    }
  }
  
  class DatePicker extends HTMLElement {// Proceed to add it to HTML as well
    format = 'MMM DD, YYYY';
    position = 'bottom';
    visible = false;
    date = null;
    mounted = false;
    // elements
    toggleButton = null;
    calendarDropDown = null;
    calendarDateElement = null;
    calendarDaysContainer = null;
    selectedDayElement = null;
    
    constructor() {
      super();
      
      const lang = window.navigator.language; //the language to use on the browser
      const date = new Date(this.date ?? (this.getAttribute("date") || Date.now()));
      
      this.shadow = this.attachShadow({mode: "open"});
      this.date = new Day(date, lang);//The date and the language will be passed here
      this.calendar = new Calendar(this.date.year, this.date.monthNumber, lang);
      
      this.format = this.getAttribute('format') || this.format;
      this.position = DatePicker.position.includes(this.getAttribute('position')) //this is to set a static position of the calendar in the section
        ? this.getAttribute('position')
        : this.position;
      this.visible = this.getAttribute('visible') === '' 
        || this.getAttribute('visible') === 'true' //true value will turn as false
        || this.visible; 
      
      this.render();
    }
    
    connectedCallback() { // we call the element
      this.mounted = true;
      
      this.toggleButton = this.shadow.querySelector('.date-toggle'); // will give shadow to the whole calendar button
      this.calendarDropDown = this.shadow.querySelector('.calendar-dropdown'); // when the calendar is clicked on the toggle button, a drop down menu will show up
      const [prevBtn, calendarDateElement, nextButton] = this.calendarDropDown
        .querySelector('.header').children; // Here we are creating a new const with the buttons for the previous month and the next month as well as the calendar date. This is part of the header of the calendar.
      this.calendarDateElement = calendarDateElement;
      this.calendarDaysContainer = this.calendarDropDown.querySelector('.month-days');
      
      this.toggleButton.addEventListener('click', () => this.toggleCalendar());
      prevBtn.addEventListener('click', () => this.prevMonth());// We are creatingng a new event for the previous button which will take us to the previous month
      nextButton.addEventListener('click', () => this.nextMonth());// We are creating a new event for the next button which will take us to thenext month
      document.addEventListener('click', (e) => this.handleClickOut(e)); // When users click out of the document
      
      this.renderCalendarDays();
    }
 

    attributeChangedCallback(name, oldValue, newValue) {
      if(!this.mounted) return;
      
      switch(name) {
        case "date":
          this.date = new Day(new Date(newValue));
          this.calendar.goToDate(this.date.monthNumber, this.date.year);
          this.renderCalendarDays();
          this.updateToggleText();
          break;
        case "format":
          this.format = newValue;
          this.updateToggleText();
          break;
        case "visible":
          this.visible = ['', 'true', 'false'].includes(newValue) 
            ? newValue === '' || newValue === 'true'
            : this.visible;
          this.toggleCalendar(this.visible);
          break;
        case "position":
          this.position = DatePicker.position.includes(newValue)
            ? newValue
            : this.position;
          this.calendarDropDown.className = 
            `calendar-dropdown ${this.visible ? 'visible' : ''} ${this.position}`;
          break;
      }
    }
    
    toggleCalendar(visible = null) {
      if(visible === null) {
        this.calendarDropDown.classList.toggle('visible');
      } else if(visible) {
        this.calendarDropDown.classList.add('visible');
      } else {
        this.calendarDropDown.classList.remove('visible');
      }
      
      this.visible = this.calendarDropDown.className.includes('visible');
      
      if(this.visible) {
        this.calendarDateElement.focus();
      } else {
        this.toggleButton.focus();
        
        if(!this.isCurrentCalendarMonth()) {
          this.calendar.goToDate(this.date.monthNumber, this.date.year);
          this.renderCalendarDays();
        }
      }
    }
    
    prevMonth() { // This function is going to render the previous month by clicking on it
      this.calendar.goToPreviousMonth();
      this.renderCalendarDays();
    }
    
    nextMonth() {// This function is going to render the next month by clicking on it
      this.calendar.goToNextMonth();
      this.renderCalendarDays();
    }
    
    updateHeaderText() { // will change the header text of the button for the new date selcted
      this.calendarDateElement.textContent = 
        `${this.calendar.month.name}, ${this.calendar.year}`; // for that purpose we are calling this function, which is going to show us the months of the year when clicking the arrows
      const monthYear = `${this.calendar.month.name}, ${this.calendar.year}`
      this.calendarDateElement
        .setAttribute('aria-label', `current month ${monthYear}`);
    }
    
    isSelectedDate(date) {
      return date.date === this.date.date &&
        date.monthNumber === this.date.monthNumber &&
        date.year === this.date.year;
    }
    
    isCurrentCalendarMonth() { // when we refresh the calendar will bring back the current date
      return this.calendar.month.number === this.date.monthNumber &&
        this.calendar.year === this.date.year;
    }
    
    selectDay(el, day) { //here is going to select any date that the user wants. Is going to be shown with a different background such as dark turquoise.
      if(day.isEqualTo(this.date)) return;
      
      this.date = day;
      
      if(day.monthNumber !== this.calendar.month.number) {
        this.prevMonth();
      } else {
        el.classList.add('selected');
        this.selectedDayElement.classList.remove('selected');
        this.selectedDayElement = el;
      }
      
      this.toggleCalendar();
      this.updateToggleText();
    }
    
    handleClickOut(e) { // when users click out of the calendar
      if(this.visible && (this !== e.target)) { // for hidding the calendar
        this.toggleCalendar(false);
      }
    }
    
    getWeekDaysElementStrings() { // All first weekdays of the month are going to be shown by this function, as a row
      return this.calendar.weekDays
        .map(weekDay => `<span>${weekDay.substring(0, 3)}</span>`)
        .join(''); //making closer the weekdays in between each other
    }
    
    getMonthDaysGrid() { // to organize all the weekdays of the month displayed on a grid, composed by 7 columns
      const firstDayOfTheMonth = this.calendar.month.getDay(1);
      const prevMonth = this.calendar.getPreviousMonth();
      const totalLastMonthFinalDays = firstDayOfTheMonth.dayNumber - 1;
      const totalDays = this.calendar.month.numberOfDays + totalLastMonthFinalDays; // how many days has that month
      const monthList = Array.from({length: totalDays});
      
      for(let i = totalLastMonthFinalDays; i < totalDays; i++) {
        monthList[i] = this.calendar.month.getDay(i + 1 - totalLastMonthFinalDays)
      }
      
      for(let i = 0; i < totalLastMonthFinalDays; i++) {
        const inverted = totalLastMonthFinalDays - (i + 1);
        monthList[i] = prevMonth.getDay(prevMonth.numberOfDays - inverted);
      }
      
      return monthList;
    }
    
    updateToggleText() { // is going to update the day selected by the user when clicking out of the calendar
      const date = this.date.format(this.format)
      this.toggleButton.textContent = date;
    }
    
    updateMonthDays() { // this will actually show the weekdays organized in the previous grid mentioned before, and will update them.
      this.calendarDaysContainer.innerHTML = '';
      
      this.getMonthDaysGrid().forEach(day => {
        const el = document.createElement('button');
        el.className = 'month-day';
        el.textContent = day.date;
        el.addEventListener('click', (e) => this.selectDay(el, day));
        el.setAttribute('aria-label', day.format(this.format));
          
        if(day.monthNumber === this.calendar.month.number) {
          el.classList.add('current');
        }
  
        if(this.isSelectedDate(day)) {
          el.classList.add('selected');
          this.selectedDayElement = el;
        }
        
        this.calendarDaysContainer.appendChild(el);
      })
    }
    
    renderCalendarDays() {
      this.updateHeaderText();
      this.updateMonthDays();
      this.calendarDateElement.focus();
    }
    
    static get observedAttributes() { 
      return ['date', 'format', 'visible', 'position']; 
    }
      
    static get position() {
      return ['top', 'left', 'bottom', 'right'];
    }
    

    //this is the style for the calendar, very similar to css format
    get style() {
      return `
        :host {
          position: relative;
          font-family: sans-serif;
        }
        
        .date-toggle {
          padding: 8px 15px;
          border: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background: #eee;
          color: #333;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          text-transform: capitalize;
        }
        
        .calendar-dropdown {
          display: none;
          width: 300px;
          height: 300px;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-50%, 8px);
          padding: 20px;
          background: #fff;
          border-radius: 5px;
          box-shadow: 0 0 8px rgba(0,0,0,0.2);
        }
        
        .calendar-dropdown.top {
          top: auto;
          bottom: 100%;
          transform: translate(-50%, -8px);
        }
        
        .calendar-dropdown.left {
          top: 50%;
          left: 0;
          transform: translate(calc(-8px + -100%), -50%);
        }
        
        .calendar-dropdown.right {
          top: 50%;
          left: 100%;
          transform: translate(8px, -50%);
        }
        
        .calendar-dropdown.visible {
          display: block;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0 30px;
        }
        
        .header h4 {
          margin: 0;
          text-transform: capitalize;
          font-size: 21px;
          font-weight: bold;
        }
        
        .header button {
          padding: 0;
          border: 8px solid transparent;
          width: 0;
          height: 0;
          border-radius: 2px;
          border-top-color: #222;
          transform: rotate(90deg);
          cursor: pointer;
          background: none;
          position: relative;
        }
        
        .header button::after {
          content: '';
          display: block;
          width: 25px;
          height: 25px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        
        .header button:last-of-type {
          transform: rotate(-90deg);
        }
        
        .week-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-gap: 5px;
          margin-bottom: 10px;
        }
        
        .week-days span {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 10px;
          text-transform: capitalize;
        }
        
        .month-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-gap: 5px;
        }
        
        .month-day {
          padding: 8px 5px;
          background: #c7c9d3;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 2px;
          cursor: pointer;
          border: none;
        }
        
        .month-day.current {
          background: #444857;
        }
        
        .month-day.selected {
          background: #28a5a7;
          color: #ffffff;
        }
        
        .month-day:hover {
          background: #34bd61;
        }
      `;
    }
    

    //Render will show all the elements of the calendar, like if there were made in HTML
    render() {
      const monthYear = `${this.calendar.month.name}, ${this.calendar.year}`;
      const date = this.date.format(this.format)
      this.shadow.innerHTML = `
        <style>${this.style}</style>
        <button type="button" class="date-toggle">${date}</button>
        <div class="calendar-dropdown ${this.visible ? 'visible' : ''} ${this.position}">
          <div class="header">
              <button type="button" class="prev-month" aria-label="previous month"></button>
              <h4 tabindex="0" aria-label="current month ${monthYear}">
                ${monthYear}
              </h4>
              <button type="button" class="prev-month" aria-label="next month"></button>
          </div>
          <div class="week-days">${this.getWeekDaysElementStrings()}</div> 
          <div class="month-days"></div>
        </div>
      `
    }
  }
  
  customElements.define("date-picker", DatePicker);