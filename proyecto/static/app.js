
const checkInBtn = document.getElementById("checkInBtn");
const checkOutBtn = document.getElementById("checkOutBtn");
const logoutBtn = document.getElementById("logoutButton");
window.onload = async () => {
    try {
        const response = await fetch("/check-data", {
            method: "GET",
            credentials: "same-origin",
        });

        if (response.ok) {
            const data = await response.json();
            if (data.check_in && !data.check_out) {
                checkInBtn.disabled = true;
                checkOutBtn.disabled = false;
                checkOutBtn.classList.remove("d-none");
            } else if (data.check_out) {
                checkInBtn.disabled = true;
                checkOutBtn.disabled = true;
                checkOutBtn.classList.add("d-none");
            } else {
                checkInBtn.disabled = false;
                checkOutBtn.disabled = true;
                checkOutBtn.classList.add("d-none");
            }
        } else {
            console.error("Error al obtener datos del servidor.");
        }
    } catch (err) {
        console.error("Error al cargar datos:", err);
    }
};
checkInBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("/check-in", {
            method: "POST",
            credentials: "same-origin", 
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message); 
            checkInBtn.disabled = true;
            checkOutBtn.disabled = false;
            checkOutBtn.classList.remove("d-none"); 
        } else {
            const error = await response.json();
            alert(error.detail || "Ocurrió un error al hacer check-in.");
        }
    } catch (err) {
        console.error("Error en check-in:", err);
        alert("No se pudo completar el check-in.");
    }
});

checkOutBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("/check-out", {
            method: "POST",
            credentials: "same-origin", 
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message); 
            checkOutBtn.disabled = true; 
            checkOutBtn.classList.add("d-none"); 
        } else {
            const error = await response.json();
            alert(error.detail || "Ocurrió un error al hacer check-out.");
        }
    } catch (err) {
        console.error("Error en check-out:", err);
        alert("No se pudo completar el check-out.");
    }
});
logoutBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("/logout", {
            method: "POST",
            credentials: "same-origin", 
        });

        if (response.ok) {
            alert("Sesión cerrada correctamente.");
            window.location.href = "/"; 
        } else {
            alert("No se pudo cerrar sesión.");
        }
    } catch (err) {
        console.error("Error al cerrar sesión:", err);
        alert("Ocurrió un error al cerrar sesión.");
    }
});
