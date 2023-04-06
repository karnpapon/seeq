#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod lib;
use crate::lib::midi::{
  MidiState, 
  list_midi_connections, 
  setup_midi_out, 
  init_midi, 
  setup_midi_connection_list,
  send_midi_out
};
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

fn main() {
  let osc = CustomMenuItem::new("OSC".to_string(), "OSC (Open Sound Control)");
  let udp = CustomMenuItem::new("UDP".to_string(), "UDP (User Datagram Protocol)");
  let rev = CustomMenuItem::new("REV".to_string(), "reverse step (r)");
  let focus = CustomMenuItem::new("FOC".to_string(), "focus (f)");
  let metronome = CustomMenuItem::new("METRONOME".to_string(), "Enable Metronome Sound");
  let note_ratio = CustomMenuItem::new("RESETNOTERATIO".to_string(), "Reset Note Ratio (1:16)");
  let submenu_app = Submenu::new("App", Menu::new().add_item(metronome).add_item(note_ratio));
  let submenu_commu = Submenu::new("Communications", Menu::new().add_item(osc).add_item(udp));
  let submenu_controls = Submenu::new("Controls", Menu::new().add_item(rev).add_item(focus));
  let menu = Menu::new() 
    .add_submenu(Submenu::new("", Menu::new().add_native_item(MenuItem::Quit)))
    .add_submenu(submenu_app)
    .add_submenu(submenu_controls)
    .add_submenu(submenu_commu);

  tauri::Builder::default()
    .menu(menu)
    .on_menu_event(|event| {
      match event.menu_item_id() {
        "OSC" => { event.window().emit("menu-osc", true).unwrap(); }
        "UDP" => { },
        "REV" => {  event.window().emit("menu-rev", true).unwrap(); },
        "FOC" => {  event.window().emit("menu-focus", true).unwrap(); }
        "METRONOME" => {  event.window().emit("menu-metronome", true).unwrap(); }
        "RESETNOTERATIO" => {  event.window().emit("menu-reset_noteratio", true).unwrap(); }
        _ => {}
      }
    })
    .manage(MidiState { ..Default::default() })
    .invoke_handler(tauri::generate_handler![
      init_midi,
      list_midi_connections,
      setup_midi_connection_list,
      setup_midi_out,
      send_midi_out
      ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}