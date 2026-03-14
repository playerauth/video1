(function() {
const loader = document.createElement('div');
loader.style = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:white;display:flex;align-items:center;justify-content:center;z-index:9999;font-size:3vh;font-weight:1000";
loader.innerHTML = "Loading... If it take too much time please go back to results page reload it and re click the tab you want to see...";
document.body.appendChild(loader);
  
  const params = new URLSearchParams(location.search);
  const query = params.get('q') || 'Car';

  const searchInput = document.querySelector('input');
  if (searchInput) searchInput.value = query; 
  // 2. INJECT CSS
  const style = document.createElement('style');
  style.innerHTML = `
    /* 1️⃣ THE MAIN SCROLLABLE CONTAINER */
#cse-results {
    width: 98vw !important;
    margin: 40px auto !important;
    height: 75vh !important;
    overflow-y: auto !important;
    position: fixed !important;
    overflow-x: hidden !important;
    background: #eeeeee !important;
    border-radius: 5px !important;
    margin-top: 2vh !important;
    padding: 20px 0 !important;
    margin-left: 1vw !important;
    -webkit-overflow-scrolling: touch;
}

/* 2️⃣ THE CARDS (FORCING TABLE TO STACK) */
.gsc-webResult .gsc-result {
    width: 88vw !important;
    font-weight: 900 !important;
    margin: 0 auto 20px 5vw !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    padding: 15px !important;
    box-sizing: border-box !important;
}

/* 🟢 THE KEY FIX: KILL THE TABLE STRUCTURE */
.gsc-table-result, 
.gsc-table-result tbody, 
.gsc-table-result tr {
    display: flex !important;
    flex-direction: column !important; /* Forces vertical stacking */
    width: 100% !important;
}

.gsc-table-cell-thumbnail, 
.gsc-table-cell-snippet-close {
    display: block !important;
    width: 100% !important;
    padding: 0 !important;
}

/* 3️⃣ MOVE THUMBNAIL BELOW TEXT */
.gsc-table-cell-thumbnail {
    order: 2 !important; /* Moves image container to bottom */
    margin-top: 10px !important;
}

.gsc-table-cell-snippet-close {
    order: 1 !important; /* Keeps text container on top */
}

/* 4️⃣ THUMBNAIL IMAGE STYLING */
.gsc-thumbnail {
    display: block !important;
    width: 80vw !important;
    margin-left: 2vw !important;
  margin-bottom: 2vh !important;
    height: 20vh !important;
}

.gsc-thumbnail img {
    border-radius: 4px !important;
    width: 80vw !important;
    height: 20vh !important; /* Prevents image from being too tall */
    display: block !important;
    border: 2px solid #007bff !important;
    margin: 5px 0 !important; /* Aligns to left like the text */
}

/* 5️⃣ CLEANUP & VISIBILITY */
.gs-title, .gs-snippet, .gsc-url-top, .gsc-url-bottom {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

/* Hide duplicate title in snippet */
.gsc-table-cell-snippet-close .gs-title { 
    display: none !important; 
}

/* Remove line breaks */
.gs-title br, .gs-snippet br { 
    display: none !important; 
}

/* 6️⃣ PAGINATION & UI CLEANUP */
.gsc-cursor-box {
    display: block !important;
    text-align: center !important;
    margin: 20px 0 !important;
}

.gsc-adBlock { display: none !important; }
.gsc-control-cse { padding: 0 !important; border: none !important; background: transparent !important; }


  `;
  document.head.appendChild(style);

  // 3. GOOGLE CSE LOGIC (Explicit Render)
  window.__gcse = {
    parsetags: 'explicit',
    initializationCallback: function() {
      const renderSearch = () => {
        const containerId = 'cse-results';
        let cseDiv = document.getElementById(containerId);
        
        if (!cseDiv) {
          cseDiv = document.createElement('div');
          cseDiv.id = containerId;
          const nav = document.querySelector('.up');
          nav ? nav.parentNode.insertBefore(cseDiv, nav.nextSibling) : document.body.appendChild(cseDiv);
        }

        google.search.cse.element.render({ 
          div: containerId, 
          tag: 'searchresults-only', 
          gname: 'aio-search' 
        });

        google.search.cse.element.getElement('aio-search').execute(query);
        setTimeout(()=>loader.remove(),800);
      };

      if (document.readyState === 'complete') renderSearch();
      else google.setOnLoadCallback(renderSearch, true);
    }
  };
 
  setTimeout(function() {
    window.scrollTo({
        top: 180,
        behavior: 'auto'
    });
}, 100);
  // Simple function to add powered by Google text
function addPoweredByGoogle() {
  // Small delay to ensure Google results are loaded
  setTimeout(function() {
    const googleResults = document.getElementById('cse-results');
    if (!googleResults) return;
    
    // Check if Google results actually exist
    if (!googleResults.querySelector('.gsc-control-cse')) return;
    
    // Remove any existing powered by text
    const existingPoweredBy = document.getElementById('powered-by-google');
    if (existingPoweredBy) existingPoweredBy.remove();
    
    // Create powered by text
    const poweredBy = document.createElement('div');
    poweredBy.id = 'powered-by-google';
    poweredBy.style.cssText = `
      text-align: center;
      padding: 20px;
      margin: 10px auto 40px auto;
      font-family: Arial, sans-serif;
      font-size: 14px;
      color: #ccc;
      width: 80vw;
      max-width: 800px;
    `;
    poweredBy.innerHTML = 'Powered by <span style="color: #4285f4; font-weight: 500;"><a href="https://www.google.com" style="text-decoration: none;">Google</a></span> Search';
    
    // Append AFTER all Google content
    googleResults.appendChild(poweredBy);
  }, 2000); // Wait 2 seconds for Google to fully load
}

// Only run once when page loads and when tabs are clicked
window.addEventListener('load', function() {
  setTimeout(addPoweredByGoogle, 2500);
});

// Also run when ALL or WEB tab is clicked
document.addEventListener('click', function(e) {
  if (e.target.id === 'all' || e.target.closest('#all') || 
      e.target.id === 'web' || e.target.closest('#web')) {
    setTimeout(addPoweredByGoogle, 2500);
  }
}, true);
})();

