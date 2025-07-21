import Principal "mo:base/Principal";
import Map "mo:motoko-hash-map/Map";
import StableBuffer "mo:StableBuffer/StableBuffer";
import Text "mo:base/Text";
import Array "mo:base/Array";

actor NootverseBackend {

  let { phash } = Map;

  type Errors = {
    #NotFound;
  };

  type Note = {
    id : Text;
    title : Text;
    content : Text;
    tags : [Text];
  };

  stable let notesByUser : Map.Map<Principal, StableBuffer.StableBuffer<Note>> = Map.new();

  public shared ({ caller }) func addNote(id : Text, title : Text, content : Text, tags : [Text]) : async () {
    let userNotes : StableBuffer.StableBuffer<Note> = switch (Map.get(notesByUser, phash, caller)) {
      case null StableBuffer.init<Note>();
      case (?v) v;
    };

    let newNote : Note = {
      id = id;
      title = title;
      content = content;
      tags = tags;
    };

    StableBuffer.add(userNotes, newNote);
    Map.set(notesByUser, phash, caller, userNotes);
  };

  public query ({ caller }) func getAllOwnedNotes() : async [Note] {
    let userNotes : StableBuffer.StableBuffer<Note> = switch (Map.get(notesByUser, phash, caller)) {
      case null StableBuffer.init<Note>();
      case (?v) v;
    };
    return StableBuffer.toArray(userNotes);
  };

  public shared ({ caller }) func updateNote(keyId : Nat, id : Text, title : Text, content : Text, tags : [Text]) : async () {
    let userNotes : StableBuffer.StableBuffer<Note> = switch (Map.get(notesByUser, phash, caller)) {
      case null StableBuffer.init<Note>();
      case (?v) v;
    };

    let updatedNote : Note = {
      id = id;
      title = title;
      content = content;
      tags = tags;
    };

    StableBuffer.put(userNotes, keyId, updatedNote);
  };

  public shared ({ caller }) func deleteNote(id : Nat) : async () {
    let userNotes : StableBuffer.StableBuffer<Note> = switch (Map.get(notesByUser, phash, caller)) {
      case null StableBuffer.init<Note>();
      case (?v) v;
    };

    let _ = StableBuffer.remove(userNotes, id);
  };

  public query ({ caller }) func searchNotes(queryString : Text) : async [Note] {
    let userNotes : StableBuffer.StableBuffer<Note> = switch (Map.get(notesByUser, phash, caller)) {
      case null StableBuffer.init<Note>();
      case (?v) v;
    };

    let notesArray = StableBuffer.toArray(userNotes);
    let results = StableBuffer.init<Note>();
    let lowerQuery = Text.toLowercase(queryString);
    
    for (note in notesArray.vals()) {
      let lowerTitle = Text.toLowercase(note.title);
      let lowerContent = Text.toLowercase(note.content);
      
      // Search in tags
      var tagMatch = false;
      for (tag in note.tags.vals()) {
        let lowerTag = Text.toLowercase(tag);
        if (Text.contains(lowerTag, #text lowerQuery)) {
          tagMatch := true;
        };
      };
      
      if (Text.contains(lowerTitle, #text lowerQuery) or 
          Text.contains(lowerContent, #text lowerQuery) or 
          tagMatch) {
        StableBuffer.add(results, note);
      };
    };
    
    return StableBuffer.toArray(results);
  };

  public query ({ caller }) func whoami() : async Principal {
    return caller;
  };
};