const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarTitle = document.querySelector('.calendar-title');
    const calendarDaysContainer = document.getElementById('calendar-days');
    const currentYearElem = document.getElementById('current-year');
    const currentDayNameElem = document.getElementById('current-day-name');
    const currentMonthElem = document.getElementById('current-month');
    const currentDayNumberElem = document.getElementById('current-day-number');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Function to generate the calendar days
    function generateCalendar(month, year) {
        calendarDaysContainer.innerHTML = '';
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const adjustedFirstDay = firstDay === 0 ? 7 : firstDay;

        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        calendarTitle.textContent = `${monthNames[month]} ${year}`;

        for (let i = 1; i < adjustedFirstDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('day');
            calendarDaysContainer.appendChild(emptyDiv);
        }

        for (let day = 1; day <= lastDate; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.textContent = day;

            if (day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                dayDiv.classList.add('today');
            }

            dayDiv.addEventListener('click', () => {
                const clickedDate = new Date(year, month, day);
                updateHeader(clickedDate);
            });

            calendarDaysContainer.appendChild(dayDiv);
        }
    }

    // Function to update header with current day, month, and year
    function updateHeader(date) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        currentYearElem.textContent = date.getFullYear();
        currentDayNameElem.textContent = dayNames[date.getDay()];
        currentMonthElem.textContent = monthNames[date.getMonth()];
        currentDayNumberElem.textContent = date.getDate();
    }

    // Initialize the year selector panel with a range of years

    // Show/Hide year selector panel
    function toggleYearSelector(show) {
        yearSelectorPanel.style.display = show ? 'block' : 'none';
    }

    // Event listeners for month navigation
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
        updateHeader(new Date(currentYear, currentMonth, currentDate.getDate()));
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
        updateHeader(new Date(currentYear, currentMonth, currentDate.getDate()));
    });

    // Initialize the calendar with the current month and year
    generateCalendar(currentMonth, currentYear);
    updateHeader(currentDate);