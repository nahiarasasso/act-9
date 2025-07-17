  // Variables globales
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();
        let userEvents = {}; // Almacenar eventos del usuario
        let editingEvent = null; // Para controlar qué evento se está editando

        // Nombres de los meses
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        // Feriados argentinos 2025 con descripciones
        const feriados = {
            "2025-01-01": {
                nombre: "Año Nuevo",
                descripcion: "Celebración del inicio del nuevo año calendario. Es una fecha de renovación y nuevos comienzos.",
                icono: "🎊"
            },
            "2025-02-24": {
                nombre: "Carnaval",
                descripcion: "Festividad popular que se celebra tradicionalmente antes del inicio de la Cuaresma cristiana.",
                icono: "🎭"
            },
            "2025-02-25": {
                nombre: "Carnaval",
                descripcion: "Segundo día del Carnaval, continuación de las festividades populares tradicionales.",
                icono: "🎭"
            },
            "2025-03-24": {
                nombre: "Día Nacional de la Memoria",
                descripcion: "Día de recordación por la Verdad y la Justicia, en memoria de las víctimas de la última dictadura militar.",
                icono: "🕊️"
            },
            "2025-04-02": {
                nombre: "Día del Veterano",
                descripcion: "Día del Veterano y de los Caídos en la Guerra de Malvinas, en honor a quienes participaron en el conflicto.",
                icono: "🇦🇷"
            },
            "2025-04-18": {
                nombre: "Viernes Santo",
                descripcion: "Conmemoración cristiana de la crucifixión de Jesucristo, parte de la Semana Santa.",
                icono: "✝️"
            },
            "2025-05-01": {
                nombre: "Día del Trabajador",
                descripcion: "Día Internacional de los Trabajadores, en reconocimiento a la lucha obrera por mejores condiciones laborales.",
                icono: "⚒️"
            },
            "2025-05-25": {
                nombre: "Revolución de Mayo",
                descripcion: "Conmemoración del primer gobierno patrio establecido en 1810, primer paso hacia la independencia.",
                icono: "🏛️"
            },
            "2025-06-16": {
                nombre: "Paso a la Inmortalidad del General Güemes",
                descripcion: "Homenaje a Martín Miguel de Güemes, héroe de la independencia y defensor de la frontera norte.",
                icono: "⚔️"
            },
            "2025-06-20": {
                nombre: "Paso a la Inmortalidad de la Bandera",
                descripcion: "Día de la Bandera, en honor a Manuel Belgrano, creador de la bandera argentina.",
                icono: "🏳️"
            },
            "2025-07-09": {
                nombre: "Día de la Independencia",
                descripcion: "Conmemoración de la Declaración de la Independencia Argentina proclamada en Tucumán en 1816.",
                icono: "🗽"
            },
            "2025-08-17": {
                nombre: "Paso a la Inmortalidad del Gral. San Martín",
                descripcion: "Homenaje a José de San Martín, el Libertador de América y Padre de la Patria.",
                icono: "🐎"
            },
            "2025-10-12": {
                nombre: "Día del Respeto a la Diversidad Cultural",
                descripcion: "Día de reflexión sobre la diversidad cultural y el encuentro entre pueblos y culturas.",
                icono: "🌍"
            },
            "2025-11-20": {
                nombre: "Día de la Soberanía Nacional",
                descripcion: "Conmemoración de la Batalla de la Vuelta de Obligado, símbolo de la defensa de la soberanía nacional.",
                icono: "🛡️"
            },
            "2025-12-08": {
                nombre: "Inmaculada Concepción",
                descripcion: "Festividad católica que celebra la concepción inmaculada de la Virgen María.",
                icono: "👼"
            },
            "2025-12-25": {
                nombre: "Navidad",
                descripcion: "Celebración cristiana del nacimiento de Jesucristo, festividad familiar y de paz.",
                icono: "🎄"
            }
        };

        // Función para verificar si un año es bisiesto
        function esBisiesto(year) {
            return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        }

        // Función para obtener el número de días en un mes
        function getDaysInMonth(month, year) {
            return new Date(year, month + 1, 0).getDate();
        }

        // Función para obtener el primer día de la semana del mes
        function getFirstDayOfMonth(month, year) {
            const firstDay = new Date(year, month, 1).getDay();
            return firstDay === 0 ? 6 : firstDay - 1;
        }

        // Función para formatear fecha
        function formatDate(year, month, day) {
            return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }

        // Función para verificar si una fecha es feriado
        function esFeriado(dateString) {
            return feriados.hasOwnProperty(dateString);
        }

        // Función para verificar si es el día actual
        function esHoy(year, month, day) {
            const today = new Date();
            return year === today.getFullYear() && 
                   month === today.getMonth() && 
                   day === today.getDate();
        }

        // Función para verificar si es fin de semana
        function esFinDeSemana(year, month, day) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            return dayOfWeek === 0 || dayOfWeek === 6;
        }

        // Función para verificar si tiene eventos
        function tieneEventos(dateString) {
            return userEvents[dateString] && userEvents[dateString].length > 0;
        }

        // Función para generar el calendario
        function generateCalendar(month, year) {
            const calendarDays = document.getElementById('calendar-days');
            const monthElement = document.getElementById('month');
            const yearElement = document.getElementById('year');
            
            monthElement.textContent = monthNames[month];
            yearElement.textContent = year;
            
            calendarDays.innerHTML = '';
            
            const daysInMonth = getDaysInMonth(month, year);
            const firstDay = getFirstDayOfMonth(month, year);
            const daysInPrevMonth = getDaysInMonth(month - 1 < 0 ? 11 : month - 1, 
                                                   month - 1 < 0 ? year - 1 : year);
            
            // Días del mes anterior
            for (let i = firstDay - 1; i >= 0; i--) {
                const day = daysInPrevMonth - i;
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar__item calendar__item--other-month';
                dayElement.textContent = day;
                calendarDays.appendChild(dayElement);
            }
            
            // Días del mes actual
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar__item';
                
                const dayNumber = document.createElement('div');
                dayNumber.textContent = day;
                dayElement.appendChild(dayNumber);
                
                const dateString = formatDate(year, month, day);
                dayElement.setAttribute('data-day', day);
                dayElement.setAttribute('data-date', dateString);
                
                // Aplicar clases especiales
                if (esHoy(year, month, day)) {
                    dayElement.classList.add('calendar__day--today');
                }
                
                if (esFeriado(dateString)) {
                    dayElement.classList.add('calendar__day--holiday');
                }
                
                if (esFinDeSemana(year, month, day)) {
                    dayElement.classList.add('calendar__day--weekend');
                }
                
                if (tieneEventos(dateString)) {
                    dayElement.classList.add('calendar__day--has-event');
                }
                
                // Agregar puntos para eventos
                if (tieneEventos(dateString)) {
                    const eventDots = document.createElement('div');
                    eventDots.className = 'event-dots';
                    const eventCount = Math.min(userEvents[dateString].length, 3);
                    for (let i = 0; i < eventCount; i++) {
                        const dot = document.createElement('div');
                        dot.className = 'event-dot';
                        eventDots.appendChild(dot);
                    }
                    dayElement.appendChild(eventDots);
                }
                
                // Agregar event listener para abrir modal
                dayElement.addEventListener('click', () => openModal(dateString, day, month, year));
                
                calendarDays.appendChild(dayElement);
            }
            
            // Completar con días del mes siguiente
            const totalCells = calendarDays.children.length;
            const remainingCells = 42 - totalCells;
            
            for (let day = 1; day <= remainingCells && remainingCells < 14; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar__item calendar__item--other-month';
                dayElement.textContent = day;
                calendarDays.appendChild(dayElement);
            }
            
            updateInfo();
        }

        // Función para abrir modal
        function openModal(dateString, day, month, year) {
            const modal = document.getElementById('modal');
            const modalTitle = document.getElementById('modal-title');
            const modalDate = document.getElementById('modal-date');
            const holidayInfo = document.getElementById('holiday-info');
            const holidayIcon = document.getElementById('holiday-icon');
            const holidayDescription = document.getElementById('holiday-description');
            
            // Configurar título y fecha
            modalDate.textContent = `${day} de ${monthNames[month]} de ${year}`;
            
            // Verificar si es feriado
            if (esFeriado(dateString)) {
                const feriadoData = feriados[dateString];
                modalTitle.textContent = feriadoData.nombre;
                holidayIcon.textContent = feriadoData.icono;
                holidayDescription.textContent = feriadoData.descripcion;
                holidayInfo.style.display = 'flex';
            } else {
                modalTitle.textContent = 'Información del día';
                holidayInfo.style.display = 'none';
            }
            
            // Cargar eventos
            loadEvents(dateString);
            
            // Configurar input para agregar eventos
            const eventInput = document.getElementById('event-input');
            eventInput.value = '';
            eventInput.setAttribute('data-date', dateString);
            
            modal.style.display = 'block';
        }

        // Función para cargar eventos
        function loadEvents(dateString) {
            const eventList = document.getElementById('event-list');
            const noEvents = document.getElementById('no-events');
            
            eventList.innerHTML = '';
            
            if (tieneEventos(dateString)) {
                userEvents[dateString].forEach((event, index) => {
                    const eventItem = document.createElement('div');
                    eventItem.className = 'event-item';
                    eventItem.setAttribute('data-index', index);
                    
                    const eventText = document.createElement('span');
                    eventText.className = 'event-text';
                    eventText.textContent = event;
                    
                    const eventActions = document.createElement('div');
                    eventActions.className = 'event-actions';
                    
                    const editBtn = document.createElement('button');
                    editBtn.className = 'edit-event-btn';
                    editBtn.innerHTML = '✏️';
                    editBtn.title = 'Editar evento';
                    editBtn.onclick = () => editEvent(dateString, index);
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-event-btn';
                    deleteBtn.innerHTML = '🗑️';
                    deleteBtn.title = 'Eliminar evento';
                    deleteBtn.onclick = () => deleteEvent(dateString, index);
                    
                    eventActions.appendChild(editBtn);
                    eventActions.appendChild(deleteBtn);
                    
                    eventItem.appendChild(eventText);
                    eventItem.appendChild(eventActions);
                    eventList.appendChild(eventItem);
                });
            } else {
                const noEventsDiv = document.createElement('div');
                noEventsDiv.className = 'no-events';
                noEventsDiv.textContent = 'No hay eventos para este día';
                eventList.appendChild(noEventsDiv);
            }
        }

        // Función para agregar evento
        function addEvent() {
            const eventInput = document.getElementById('event-input');
            const dateString = eventInput.getAttribute('data-date');
            const eventText = eventInput.value.trim();
            
            if (eventText !== '') {
                if (!userEvents[dateString]) {
                    userEvents[dateString] = [];
                }
                
                userEvents[dateString].push(eventText);
                loadEvents(dateString);
                generateCalendar(currentMonth, currentYear);
                eventInput.value = '';
            }
        }

        // Función para editar evento
        function editEvent(dateString, index) {
            // Cancelar cualquier edición anterior
            if (editingEvent) {
                cancelEdit();
            }
            
            const eventItem = document.querySelector(`[data-index="${index}"]`);
            const eventText = eventItem.querySelector('.event-text');
            const eventActions = eventItem.querySelector('.event-actions');
            
            // Guardar referencia del evento que se está editando
            editingEvent = { dateString, index, eventItem, originalText: eventText.textContent };
            
            // Crear input de edición
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.className = 'edit-input';
            editInput.value = eventText.textContent;
            
            // Crear botones de acción
            const editActions = document.createElement('div');
            editActions.className = 'edit-actions';
            
            const saveBtn= document.createElement('button');
            saveBtn.className = 'save-btn';
            saveBtn.textContent = 'Guardar';
            saveBtn.onclick = () => saveEdit(dateString, index, editInput.value);
            
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'cancel-btn';
            cancelBtn.textContent = 'Cancelar';
            cancelBtn.onclick = cancelEdit;
            
            editActions.appendChild(saveBtn);
            editActions.appendChild(cancelBtn);
            
            // Reemplazar contenido del evento
            eventItem.innerHTML = '';
            eventItem.appendChild(editInput);
            eventItem.appendChild(editActions);
            
            editInput.focus();
            editInput.select();
        }

        // Función para guardar edición
        function saveEdit(dateString, index, newText) {
            if (newText.trim() !== '') {
                userEvents[dateString][index] = newText.trim();
                loadEvents(dateString);
                generateCalendar(currentMonth, currentYear);
            }
            editingEvent = null;
        }

        // Función para cancelar edición
        function cancelEdit() {
            if (editingEvent) {
                loadEvents(editingEvent.dateString);
                editingEvent = null;
            }
        }

        // Función para eliminar evento
        function deleteEvent(dateString, index) {
            if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
                userEvents[dateString].splice(index, 1);
                
                // Si no quedan eventos, eliminar la fecha del objeto
                if (userEvents[dateString].length === 0) {
                    delete userEvents[dateString];
                }
                
                loadEvents(dateString);
                generateCalendar(currentMonth, currentYear);
            }
        }

        // Función para actualizar información
        function updateInfo() {
            const today = new Date();
            const todayInfo = document.getElementById('today-info');
            const leapYearInfo = document.getElementById('leap-year-info');
            
            todayInfo.textContent = `${today.getDate()} de ${monthNames[today.getMonth()]} de ${today.getFullYear()}`;
            
            if (esBisiesto(currentYear)) {
                leapYearInfo.textContent = `${currentYear} es un año bisiesto (366 días)`;
                leapYearInfo.style.display = 'block';
            } else {
                leapYearInfo.textContent = `${currentYear} es un año común (365 días)`;
                leapYearInfo.style.display = 'block';
            }
        }

        // Event Listeners
        document.getElementById('prev-month').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        });

        document.getElementById('next-month').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        });

        document.getElementById('add-event-btn').addEventListener('click', addEvent);

        document.getElementById('event-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addEvent();
            }
        });

        // Cerrar modal
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('modal').style.display = 'none';
            if (editingEvent) {
                cancelEdit();
            }
        });

        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal')) {
                document.getElementById('modal').style.display = 'none';
                if (editingEvent) {
                    cancelEdit();
                }
            }
        });

        // Evitar que el modal se cierre al hacer clic dentro del contenido
        document.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Inicializar calendario
        generateCalendar(currentMonth, currentYear);

        // Actualizar año actual en el título
        document.addEventListener('DOMContentLoaded', () => {
            const currentDate = new Date();
            currentMonth = currentDate.getMonth();
            currentYear = currentDate.getFullYear();
            generateCalendar(currentMonth, currentYear);
        });
  
    