from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from typing import Optional
import json
from datetime import datetime

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

def load_users():
    with open("users.json", "r") as f:
        return json.load(f)

def save_users(users):
    with open("users.json", "w") as f:
        json.dump(users, f, indent=4)

@app.get("/", response_class=HTMLResponse)
async def login_page():
    with open("static/login.html", "r") as f:
        return HTMLResponse(content=f.read())

@app.get("/admin", response_class=HTMLResponse)
async def admin_page():
    with open("static/admin.html", "r") as f:
        return HTMLResponse(content=f.read())

@app.get("/check-in", response_class=HTMLResponse)
async def check_in_page():
    with open("static/check_in.html", "r") as f:
        return HTMLResponse(content=f.read())

@app.post("/login")
async def login(request: Request):
    try:
        data = await request.json()
    except Exception as e:
        print("Error al procesar JSON:", e)
        raise HTTPException(status_code=400, detail="Error al procesar la solicitud. Verifique el formato de los datos.")

    users = load_users()
    for user in users:
        if user["email"] == data.get("email") and user["password"] == data.get("password"):
            response = RedirectResponse(url="/admin" if user["role"] == "admin" else "/check-in", status_code=302)
            response.set_cookie("user_email", user["email"], httponly=True)  # Establecer cookie para identificar al usuario
            return response

    raise HTTPException(status_code=401, detail="Credenciales incorrectas.")

@app.post("/check-in")
async def check_in(request: Request):
    user_email = request.cookies.get("user_email")
    if not user_email:
        raise HTTPException(status_code=403, detail="Usuario no autenticado.")

    users = load_users()
    user = next((u for u in users if u["email"] == user_email), None)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    user["check_in"] = datetime.now().isoformat()
    save_users(users)
    return {"message": "Check-in exitoso"}

@app.post("/check-out")
async def check_out(request: Request):
    user_email = request.cookies.get("user_email")
    if not user_email:
        raise HTTPException(status_code=403, detail="Usuario no autenticado.")

    users = load_users()
    user = next((u for u in users if u["email"] == user_email), None)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    user["check_out"] = datetime.now().isoformat()
    save_users(users)
    return {"message": "Check-out exitoso"}

@app.get("/check-data")
async def get_check_data(request: Request):
    user_email = request.cookies.get("user_email")
    if not user_email:
        raise HTTPException(status_code=403, detail="Usuario no autenticado.")

    users = load_users()


    current_user = next((u for u in users if u["email"] == user_email), None)
    if not current_user or current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Acceso denegado: No tienes permisos de administrador.")
    return [{"name": user["name"], "check_in": user.get("check_in"), "check_out": user.get("check_out")} for user in users]

@app.post("/logout")
async def logout():
    response = RedirectResponse(url="/", status_code=302)
    response.delete_cookie("user_email") 
    return response
