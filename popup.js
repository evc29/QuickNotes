document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    var notesContainer = document.getElementById('notes-container');
    var notesList = document.getElementById('notes-list');
    var noteInput = document.getElementById('note-input');
    var addNoteBtn = document.getElementById('add-note-btn');
    var deleteAllBtn = document.getElementById('delete-all-btn');
  
    // Load existing notes from storage
    chrome.storage.local.get(['notes'], function(result) {
      var savedNotes = result.notes || [];
      renderNotes(savedNotes);
    });
  
    // Add event listener for the "Add Note" button
    addNoteBtn.addEventListener('click', function() {
      var noteText = noteInput.value.trim();
      if (noteText !== '') {
        // Retrieve existing notes from storage
        chrome.storage.local.get(['notes'], function(result) {
          var savedNotes = result.notes || [];
          savedNotes.push(noteText);
  
          // Save updated notes to storage
          chrome.storage.local.set({ 'notes': savedNotes }, function() {
            renderNotes(savedNotes);
            noteInput.value = '';
          });
        });
      }
    });
  
    // Add event listener for the "Delete All" button
    deleteAllBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to delete all notes?')) {
        // Clear notes from storage
        chrome.storage.local.remove('notes', function() {
          renderNotes([]);
        });
      }
    });
  
    // Add event listener for delete buttons on individual notes
    notesList.addEventListener('click', function(event) {
      var deleteButton = event.target.closest('.delete-note-btn');
      if (deleteButton) {
        var noteId = deleteButton.getAttribute('data-note-id');
        deleteNoteById(noteId);
      }
    });
  
    // Render the notes on the popup
    function renderNotes(notes) {
      notesList.innerHTML = '';
      if (notes.length === 0) {
        notesList.innerHTML = '<p>No notes found.</p>';
      } else {
        notes.forEach(function(note, index) {
          var noteItem = document.createElement('div');
          noteItem.className = 'note-item';
  
          var noteText = document.createElement('div');
          noteText.className = 'note-text';
          noteText.textContent = note;
          noteItem.appendChild(noteText);
  
          var deleteButton = document.createElement('button');
          deleteButton.className = 'delete-note-btn';
          deleteButton.setAttribute('data-note-id', index);
          deleteButton.textContent = 'Delete';
          noteItem.appendChild(deleteButton);
  
          notesList.appendChild(noteItem);
        });
      }
    }
  
    // Delete a note by its index
    function deleteNoteById(noteId) {
      // Retrieve existing notes from storage
      chrome.storage.local.get(['notes'], function(result) {
        var savedNotes = result.notes || [];
        savedNotes.splice(noteId, 1);
  
        // Save updated notes to storage
        chrome.storage.local.set({ 'notes': savedNotes }, function() {
          renderNotes(savedNotes);
        });
      });
    }
  });
  