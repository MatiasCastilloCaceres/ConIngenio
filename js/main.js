
function initDarkModeToggle() {
    const modeToggle = document.getElementById('modeToggle');
    
    // Verificar si hay una preferencia guardada en localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        if (modeToggle) modeToggle.checked = true;
    }
    
    // Escuchar cambios en el toggle
    if (modeToggle) {
        modeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });
    }
}

function initBootstrapComponents() {
    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Inicializar popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Manejar cierre del menú móvil cuando se hace clic en un enlace
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// Función para cargar datos de servicios desde la API
function cargarDatos() {
    const headerParams = {'Authorization': 'Bearer ciisa'};
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = "https://ciisa.coningenio.cl/v1/services/";
    
    // Mostrar indicador de carga
    const servicesContainer = document.getElementById('services-container');
    if (!servicesContainer) return;
    
    servicesContainer.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando servicios...</span>
            </div>
            <p class="mt-2">Cargando servicios desde la API...</p>
        </div>
    `;

    $.ajax({
        url: proxyUrl + apiUrl,
        type: 'GET',
        dataType: 'json',
        headers: headerParams,
        beforeSend: function() {
            console.log('Iniciando solicitud a la API de servicios...');
        },
        success: function(data) {
            console.log('Datos recibidos de la API de servicios:', data);
            
            // Limpiar el contenedor
            servicesContainer.innerHTML = '';
            
            // Verificar si tenemos datos para trabajar
            if (data && data.data && data.data.length > 0) {
                // Guardar servicios para uso posterior
                services = data.data;
                
                // Renderizar cada servicio como una tarjeta
                data.data.forEach(function(servicio) {
                    const serviceCol = document.createElement('div');
                    serviceCol.className = 'col-md-6 col-lg-3 mb-4';
                    
                    serviceCol.innerHTML = `
                        <div class="card h-100 shadow-sm hover-card">
                            <img src="${servicio.image || `img/servicio-${servicio.id}.jpg`}" class="card-img-top" alt="${servicio.titulo.esp}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${servicio.titulo.esp}</h5>
                                <p class="card-text mb-4">${servicio.description.esp}</p>
                                <a href="#contacto" class="btn btn-outline-primary mt-auto" 
                                    data-service-id="${servicio.id}">Solicitar información</a>
                            </div>
                        </div>
                    `;
                    
                    servicesContainer.appendChild(serviceCol);
                    
                    // Agregar evento al botón
                    const btnSolicitar = serviceCol.querySelector('[data-service-id]');
                    if (btnSolicitar) {
                        btnSolicitar.addEventListener('click', function() {
                            const serviceId = this.getAttribute('data-service-id');
                            const selectServicio = document.getElementById('servicio');
                            if (selectServicio) {
                                selectServicio.value = serviceId;
                            }
                        });
                    }
                });
                
                // Actualizar el select del formulario
                populateServiceSelect(data.data);
            } else {
                servicesContainer.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <div class="alert alert-warning">
                            <i class="fas fa-info-circle me-2"></i>
                            No se encontraron servicios disponibles.
                        </div>
                    </div>
                `;
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al cargar los servicios:', error);
            servicesContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>Error:</strong> No se pudieron cargar los servicios. 
                        Por favor, verifica tu conexión a Internet y asegúrate de haber activado 
                        el acceso en <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">CORS Anywhere</a>.
                    </div>
                </div>
            `;
        }
    });
}

// Función para cargar datos de Nosotros desde la API
function cargarDatosNosotros() {
    const headerParams = {'Authorization': 'Bearer ciisa'};
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = "https://ciisa.coningenio.cl/v1/about-us/";
    
    // Mostrar indicador de carga
    const aboutContainer = document.getElementById('about-container');
    if (!aboutContainer) return;
    
    aboutContainer.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando información...</span>
            </div>
            <p class="mt-2">Cargando información sobre nosotros...</p>
        </div>
    `;

    $.ajax({
        url: proxyUrl + apiUrl,
        type: 'GET',
        dataType: 'json',
        headers: headerParams,
        beforeSend: function() {
            console.log('Iniciando solicitud a la API de nosotros...');
        },
        success: function(data) {
            console.log('Datos recibidos de la API de nosotros:', data);
            
            // Crear contenido HTML con los datos de la API
            aboutContainer.innerHTML = `
                <div class="row align-items-center mb-5">
                    <div class="col-lg-6 mb-4 mb-lg-0">
                        <img src="img/about-us.jpg" alt="Sobre Coningenio" class="img-fluid rounded shadow">
                    </div>
                    <div class="col-lg-6">
                        <h3 class="mb-3">Nuestra Misión</h3>
                        <p class="mission">${data.mission || 'Información no disponible'}</p>
                        
                        <h3 class="mt-4 mb-3">Nuestra Visión</h3>
                        <p class="vision">${data.vision || 'Información no disponible'}</p>
                    </div>
                </div>
                
                <div class="row mb-5">
                    <div class="col-12">
                        <h3 class="mb-3">Nuestra Historia</h3>
                        <p class="history">${data.history || 'Información no disponible'}</p>
                    </div>
                </div>
                
                <h3 class="text-center mb-4">Nuestros Valores</h3>
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <ul class="values-list list-unstyled row">
                            ${data.values && data.values.map(value => `
                                <li class="col-md-6 mb-3">
                                    <i class="fas fa-check-circle text-primary me-2"></i> ${value}
                                </li>
                            `).join('') || '<li class="col-12">Información no disponible</li>'}
                        </ul>
                    </div>
                </div>
            `;
        },
        error: function(xhr, status, error) {
            console.error('Error al cargar los datos de nosotros:', error);
            aboutContainer.innerHTML = `
                <div class="text-center py-5">
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>Error:</strong> No se pudo cargar la información. 
                        Por favor, verifica tu conexión a Internet y asegúrate de haber activado 
                        el acceso en <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">CORS Anywhere</a>.
                    </div>
                </div>
            `;
        }
    });
}

// Poblar select de servicios en formulario de contacto
function populateServiceSelect(services) {
    const select = document.getElementById('servicio');
    if (!select) return;
    
    // Mantener la opción por defecto
    const defaultOption = select.querySelector('option');
    select.innerHTML = '';
    if (defaultOption) select.appendChild(defaultOption);
    
    // Añadir opciones con los datos de la API
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = service.titulo.esp || service.title;
        select.appendChild(option);
    });
}

// Inicializar formulario de contacto con validación mejorada
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Realizar validación
        if (validateForm()) {
            // Recoger todos los datos del formulario
            const formData = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email')?.value || '',
                telefono: document.getElementById('telefono')?.value || '',
                servicio: document.getElementById('servicio').value,
                mensaje: document.getElementById('mensaje').value,
                aceptaTerminos: document.getElementById('terminos')?.checked || false
            };
            
            // Mostrar datos en la consola (según requisito)
            console.log('Datos del formulario de contacto:', formData);
            
            // Enviar datos al backend
            submitContactForm(formData);
            
            // Mostrar mensaje de éxito
            showSuccessMessage();
            
            // Limpiar formulario
            form.reset();
        }
    });
    
    // Añadir validación en tiempo real para mejorar la experiencia de usuario
    addRealTimeValidation();
}

// Validar formulario de contacto con soporte para nuevos campos
function validateForm() {
    let isValid = true;
    const errorMessages = [];
    
    // Validar nombre
    const nombre = document.getElementById('nombre');
    if (!nombre.value.trim()) {
        isValid = false;
        showFieldError(nombre, 'El nombre es obligatorio');
        errorMessages.push('El nombre es obligatorio');
    } else if (nombre.value.trim().length < 3) {
        isValid = false;
        showFieldError(nombre, 'El nombre debe tener al menos 3 caracteres');
        errorMessages.push('El nombre debe tener al menos 3 caracteres');
    } else {
        clearFieldError(nombre);
    }
    
    // Validar email si existe
    const email = document.getElementById('email');
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() && !emailRegex.test(email.value.trim())) {
            isValid = false;
            showFieldError(email, 'Ingrese un email válido');
            errorMessages.push('Ingrese un email válido');
        } else {
            clearFieldError(email);
        }
    }
    
    // Validar servicio
    const servicio = document.getElementById('servicio');
    if (servicio.value === '') {
        isValid = false;
        showFieldError(servicio, 'Por favor, seleccione un servicio');
        errorMessages.push('Por favor, seleccione un servicio');
    } else {
        clearFieldError(servicio);
    }
    
    // Validar mensaje
    const mensaje = document.getElementById('mensaje');
    if (!mensaje.value.trim()) {
        isValid = false;
        showFieldError(mensaje, 'El mensaje es obligatorio');
        errorMessages.push('El mensaje es obligatorio');
    } else if (mensaje.value.trim().length < 10) {
        isValid = false;
        showFieldError(mensaje, 'El mensaje debe tener al menos 10 caracteres');
        errorMessages.push('El mensaje debe tener al menos 10 caracteres');
    } else {
        clearFieldError(mensaje);
    }
    
    // Validar términos si existe
    const terminos = document.getElementById('terminos');
    if (terminos && !terminos.checked) {
        isValid = false;
        showFieldError(terminos, 'Debe aceptar los términos y condiciones');
        errorMessages.push('Debe aceptar los términos y condiciones');
    } else if (terminos) {
        clearFieldError(terminos);
    }
    
    if (!isValid && errorMessages.length) {
        console.error('Errores de validación:', errorMessages);
    }
    
    return isValid;
}

// Mostrar error en un campo
function showFieldError(field, message) {
    const errorElement = field.nextElementSibling;
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Limpiar error de un campo
function clearFieldError(field) {
    const errorElement = field.nextElementSibling;
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Enviar formulario de contacto al backend
function submitContactForm(formData) {
    fetch(`${API_URL}contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
        console.error('Error al enviar formulario:', error);
    });
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    alert('Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.');
}

// Añadir validación en tiempo real
function addRealTimeValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', () => {
            validateForm();
        });
    });
}

// Inicializar scroll suave para enlaces internos
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajustar por altura del header
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                document.querySelector('.menu').classList.remove('active');
            }
        });
    });
}

// Inicializar animaciones al hacer scroll
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}
