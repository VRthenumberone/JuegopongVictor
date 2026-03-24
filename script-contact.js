/* =================================
   MANEJADOR DEL FORMULARIO DE CONTACTO
   ================================= */

/**
 * Maneja el envío del formulario de contacto
 */
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const formMessage = document.getElementById('formMessage');
    
    // Validar campos
    if (!name || !email || !subject || !message) {
        formMessage.textContent = '❌ Por favor completa todos los campos';
        formMessage.classList.remove('success');
        formMessage.classList.add('error');
        return;
    }
    
    // Validar que el nombre tenga al menos 3 caracteres
    if (name.length < 3) {
        formMessage.textContent = '❌ El nombre debe tener al menos 3 caracteres';
        formMessage.classList.remove('success');
        formMessage.classList.add('error');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        formMessage.textContent = '❌ Por favor ingresa un email válido';
        formMessage.classList.remove('success');
        formMessage.classList.add('error');
        return;
    }
    
    // Validar que el mensaje tenga al menos 10 caracteres
    if (message.length < 10) {
        formMessage.textContent = '❌ El mensaje debe tener al menos 10 caracteres';
        formMessage.classList.remove('success');
        formMessage.classList.add('error');
        return;
    }
    
    // Si todo es válido, mostrar mensaje de éxito
    formMessage.textContent = '✅ ¡Mensaje enviado correctamente! Nos contactaremos pronto.';
    formMessage.classList.remove('error');
    formMessage.classList.add('success');
    
    // Limpiar formulario
    document.getElementById('contactForm').reset();
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
        formMessage.classList.remove('success', 'error');
    }, 5000);
});
