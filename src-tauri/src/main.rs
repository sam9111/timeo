// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
async fn focus_window(window: tauri::Window) {
    window.show().unwrap();
    window.set_focus().unwrap();
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![focus_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
