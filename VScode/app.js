let user = {};

function startApp() {
    const name = document.getElementById("nameInput").value;
    if (!name) return alert("Please enter your name.");
    
    user.name = name;

    document.getElementById("loginArea").classList.add("hidden");
    document.getElementById("profileArea").classList.remove("hidden");
}

function saveProfile() {
    user.major = document.getElementById("major").value;
    user.skills = document.getElementById("skills").value;
    user.needs = document.getElementById("needs").value;

    if (!user.major || !user.skills || !user.needs)
        return alert("Please fill out all fields.");

    document.getElementById("profileArea").classList.add("hidden");
    document.getElementById("matchArea").classList.remove("hidden");

    // Temporary fake matches
    const matches = [
        { name: "Aisha", major: user.major, skills: "Python, Math", needs: user.skills },
        { name: "Leo", major: user.major, skills: user.needs, needs: "Algorithms" }
    ];

    let html = "";
    matches.forEach(m => {
        html += `
            <div class='card'>
                <h3>${m.name}</h3>
                <p><strong>Major:</strong> ${m.major}</p>
                <p><strong>Can Teach:</strong> ${m.skills}</p>
                <p><strong>Needs Help In:</strong> ${m.needs}</p>
                <button>Connect</button>
            </div>
        `;
    });

    document.getElementById("results").innerHTML = html;

    function saveProfile() {
    user.major = document.getElementById("major").value;
    user.skills = document.getElementById("skills").value;
    user.needs = document.getElementById("needs").value;

    if (!user.major || !user.skills || !user.needs)
        return alert("Please fill out all fields.");

    // Save to Firestore
    db.collection("profiles")
      .doc(user.name) // or Firebase UID
      .set(user)
      .then(() => {
          alert("Profile saved!");
          showMatches();
      });
}

function showMatches() {
    db.collection("profiles").get().then((snapshot) => {
        let html = "";
        snapshot.forEach(doc => {
            const m = doc.data();
            html += `
                <div class='card'>
                    <h3>${m.name}</h3>
                    <p><strong>Major:</strong> ${m.major}</p>
                    <p><strong>Can Teach:</strong> ${m.skills}</p>
                    <p><strong>Needs Help In:</strong> ${m.needs}</p>
                    <button>Connect</button>
                </div>
            `;
        });

        document.getElementById("matchArea").classList.remove("hidden");
        document.getElementById("results").innerHTML = html;
    });
}


}
