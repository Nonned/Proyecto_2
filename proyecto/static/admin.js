const logoutBtn = document.getElementById("logoutButton");
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/check-data", {
            method: "GET",
            credentials: "same-origin", 
        });

        if (response.ok) {
            const users = await response.json();
            const tableBody = document.getElementById("check-data");
            tableBody.innerHTML = "";
            users.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.check_in ? new Date(user.check_in).toLocaleString() : "Sin registro"}</td>
                    <td>${user.check_out ? new Date(user.check_out).toLocaleString() : "Sin registro"}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            const error = await response.json();
            alert(error.detail || "No se pudieron cargar los datos.");
        }
    } catch (err) {
        console.error("Error al cargar datos de usuarios:", err);
        alert("Ocurrió un error al cargar los datos.");
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
