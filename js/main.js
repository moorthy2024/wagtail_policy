const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");
const toggleBtn = document.getElementById("toggle-btn");
const toggleIcon = document.getElementById("toggle-icon");
const overlay = document.getElementById("overlay");

// ===== Active menu =====
function setActiveMenu(link) {
  // Remove active from all links
  document.querySelectorAll(".sidebar a").forEach(a => a.classList.remove("active"));
  document.querySelectorAll(".sidebar li.folder").forEach(f => f.classList.remove("active"));

  // Set clicked link as active
  link.classList.add("active");

  // If inside a folder, open the folder
  const parentFolder = link.closest("ul.submenu")?.closest("li.folder");
  if (parentFolder) {
    parentFolder.classList.add("active");
    parentFolder.classList.add("open"); // keep submenu visible
  }

  markOpenFoldersActive();
}

// Keep folders with open state marked as active
function markOpenFoldersActive() {
  document.querySelectorAll(".sidebar li.folder").forEach(folder => {
    if (folder.classList.contains("open")) {
      folder.classList.add("active");
    } else {
      const hasActiveSub = folder.querySelector(".submenu a.active");
      if (!hasActiveSub) folder.classList.remove("active");
    }
  });
}

// ===== Load content dynamically =====
function loadContent(file) {
  if (!file) return;
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.querySelector("#content").innerHTML = html;
    })
    .catch(() => {
      document.querySelector("#content").innerHTML = "<p style='color:red'>Error loading content.</p>";
    });
}

// ===== Sidebar link click =====
document.querySelectorAll(".sidebar a[data-file]").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    setActiveMenu(link);
    loadContent(link.getAttribute("data-file"));

    // ===== Only hide submenus if main-level link clicked (not sublink) =====
    const isSubLink = link.closest("ul.submenu");
    if (!isSubLink) {
      document.querySelectorAll(".sidebar li.folder").forEach(folder => {
        folder.classList.remove("open"); // collapse all submenus
      });
    }

    markOpenFoldersActive();

    // Close mobile sidebar after selection
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
    }

    updateTogglePosition();
  });
});

// ===== Folder toggle =====
document.querySelectorAll(".sidebar .folder > a").forEach(folderLink => {
  folderLink.addEventListener("click", e => {
    e.preventDefault();
    const folder = folderLink.parentElement;
    folder.classList.toggle("open");
    markOpenFoldersActive();
  });
});

// ===== Sidebar toggle button =====
function updateTogglePosition() {
  if (window.innerWidth <= 768) {
    toggleBtn.style.left = sidebar.classList.contains("open") ? sidebar.offsetWidth + 10 + "px" : "10px";
  } else {
    toggleBtn.style.left = sidebar.classList.contains("closed") ? "10px" : sidebar.offsetWidth + "px";
  }
}

toggleBtn.addEventListener("click", () => {
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("active");
  } else {
    sidebar.classList.toggle("closed");
    main.classList.toggle("expanded");
    toggleIcon.style.transform = sidebar.classList.contains("closed") ? "rotate(180deg)" : "rotate(0deg)";
  }
  updateTogglePosition();
});

// ===== Overlay click (mobile) =====
overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("active");
  updateTogglePosition();
});

// ===== Window resize =====
window.addEventListener("resize", updateTogglePosition);

// ===== Initial setup =====
markOpenFoldersActive();
updateTogglePosition();
