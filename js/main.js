document.addEventListener('DOMContentLoaded', () => {

  // ------------- Navigation Scroll Effect -------------
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

 // ------------- Mobile Menu Toggle -------------
document.addEventListener("DOMContentLoaded", function () {

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', function () {

    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');

  });

});

  // ------------- Scroll Reveal Animations -------------
  const observeElements = document.querySelectorAll('.property-card, .section-title, .about-content, .carousel-container');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  observeElements.forEach((el) => {
    observer.observe(el);
  });

  // ------------- Form Submission Logic -------------
  const searchBtn = document.querySelector('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const landStatus = document.getElementById('form-land')?.value || 'unknown';
      const userName = document.getElementById('form-name')?.value || 'A Client';
      const userContact = document.getElementById('form-phone')?.value || 'No Contact Number Provided';

      const originalText = searchBtn.innerHTML;
      searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Email...';
      searchBtn.style.opacity = '0.7';

      // Fetch the destination email
      fetch('assets/data/companyDetails.json')
        .then(res => res.json())
        .then(data => {
          if (data.email) {
            // Determine multiple emails if comma separated
            const destinationEmails = data.email.replace(/\s+/g, ''); // Remove spaces

            const subject = encodeURIComponent("New Custom Home Consultation Request");
            const newLine = "%0D%0A"; // URL-encoded \r\n

const body =
  "Dear Suvlaxmi Realcon Team," + newLine + newLine +

  "I would like to request a consultation for a home construction." + newLine + newLine +

  "My details are as follows:" + newLine +
  "Name: " + userName + newLine +
  "Contact Number: " + userContact + newLine +
  "Land Ownership: " + (landStatus === 'yes' ? 'Yes, I own land' : 'No, I am looking for land') + newLine + newLine +

  "Please contact me to discuss the next steps." + newLine + newLine +

  "Thank you," + newLine +
  userName;

            // Open mail client
            window.location.href = `mailto:${destinationEmails}?subject=${subject}&body=${body}`;

            // Show success to user
            searchBtn.innerHTML = '<i class="fas fa-check"></i> Mail Client Opened';
            searchBtn.style.opacity = '1';
            searchBtn.classList.remove('btn-primary');
            searchBtn.style.backgroundColor = '#28a745';

            setTimeout(() => {
              searchBtn.innerHTML = originalText;
              searchBtn.classList.add('btn-primary');
              searchBtn.style.backgroundColor = '';
            }, 4000);
          } else {
            throw new Error("No destination email found in companyDetails");
          }
        })
        .catch(err => {
          console.error(err);
          searchBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
          setTimeout(() => { searchBtn.innerHTML = originalText; searchBtn.style.opacity = '1'; }, 3000);
        });
    });
  }

  // ------------- Testimonial Carousel Logic -------------
  const track = document.getElementById('testimonial-track');
  const indicatorsContainer = document.getElementById('carousel-indicators');

  let currentSlide = 0;
  let totalSlides = 0;
  let carouselInterval;
  let isPlaying = true;

  // Fetch JSON and initialize carousel
  if (track && indicatorsContainer) {
    fetch('assets/data/testimonials.json')
      .then(response => {
        if (!response.ok) throw new Error("Could not fetch testimonials data");
        return response.json();
      })
      .then(data => {
        track.innerHTML = ''; // Clear loading text
        totalSlides = data.length;

        data.forEach((testimonial, index) => {
          // Create slide
          const slide = document.createElement('div');
          slide.classList.add('testimonial-slide');
          if (index === 0) slide.classList.add('active');

          slide.innerHTML = `
            <i class="fas fa-quote-left quote-icon"></i>
            <p class="testimonial-msg">"${testimonial.message}"</p>
            <img src="${testimonial.image}" alt="${testimonial.name}" class="client-img" onerror="this.src='https://via.placeholder.com/80?text=user'">
            <div class="client-name">${testimonial.name}</div>
          `;
          track.appendChild(slide);

          // Create indicator
          const indicator = document.createElement('div');
          indicator.classList.add('indicator');
          if (index === 0) indicator.classList.add('active');

          indicator.addEventListener('click', () => {
            goToSlide(index);
            if (isPlaying) resetInterval();
          });

          indicatorsContainer.appendChild(indicator);
        });

        // Initialize carousel play/pause logic
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
          playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
              clearInterval(carouselInterval);
              isPlaying = false;
              playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
              startCarouselInterval();
              isPlaying = true;
              playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
          });
        }

        // Initialize carousel auto-rotation (7 seconds)
        startCarouselInterval();
      })
      .catch(error => {
        console.error("Error loading testimonials: ", error);
        track.innerHTML = '<div class="loading-text" style="color:var(--accent-primary);">Failed to load testimonials. Please try again later.</div>';
      });
  }

  function updateCarouselUI() {
    // Move track to show correct slide
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update active class on slides
    const slides = Array.from(track.children);
    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update active class on indicators
    const indicators = Array.from(indicatorsContainer.children);
    indicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  function goToSlide(index) {
    currentSlide = index;
    updateCarouselUI();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarouselUI();
  }

  function startCarouselInterval() {
    // 7000ms = 7 seconds
    carouselInterval = setInterval(nextSlide, 7000);
  }

  function resetInterval() {
    clearInterval(carouselInterval);
    startCarouselInterval();
  }

  // ------------- Portfolio Fetch and Render Logic -------------
  const portfolioGrid = document.getElementById('portfolio-grid');

  if (portfolioGrid) {
    fetch('assets/data/portfolio.json')
      .then(response => {
        if (!response.ok) throw new Error("Could not fetch portfolio data");
        return response.json();
      })
      .then(data => {
        portfolioGrid.innerHTML = ''; // Clear loading text

        data.forEach((project, index) => {
          const card = document.createElement('div');
          card.classList.add('property-card');
          // Start visible if we are just loading them in
          // Or let the intersection observer handle them
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';

          card.innerHTML = `
            <div class="property-img-wrap">
                <div class="property-badge">Completed ${project.completion_year}</div>
                <img src="${project.image}" alt="${project.title}">
                <div class="property-price">Custom Build</div>
            </div>
            <div class="property-info">
                <h3 class="property-title">${project.title}</h3>
                <div class="property-location"><i class="fas fa-map-marker-alt text-accent"></i> ${project.location}</div>
                <div class="property-features">
                    <span class="feature"><i class="fas fa-clock"></i> ${project.duration}</span>
                    <span class="feature"><i class="fas fa-vector-square"></i> ${project.sqft}</span>
                </div>
            </div>
          `;
          portfolioGrid.appendChild(card);
        });
      })
      .catch(error => {
        console.error("Error loading portfolio: ", error);
        portfolioGrid.innerHTML = '<div class="loading-text" style="grid-column: 1 / -1; color:var(--accent-primary);">Failed to load portfolio projects.</div>';
      });
  }

  // ------------- Company Details Fetch Logic -------------
  fetch('assets/data/companyDetails.json')
    .then(response => {
      if (!response.ok) throw new Error("Could not fetch company details");
      return response.json();
    })
    .then(data => {
      const headerLogo = document.getElementById('header-logo');
      const footerLogo = document.getElementById('footer-logo');
      const contactPhone = document.getElementById('contact-phone');
      const contactEmail = document.getElementById('contact-email');
      const contactAddress = document.getElementById('contact-address');

      if (data.name) {
        // Split name into full text and add accent to the last character or just use it as is
        // If they have a specific format, we can just replace the text
        const nameHtml = `${data.name}<span class="text-accent">.</span>`;
        if (headerLogo) headerLogo.innerHTML = nameHtml;
        if (footerLogo) footerLogo.innerHTML = nameHtml;

        // Update document title optionally
        document.title = data.name + " | Custom Home Developers";
      }

      if (data.phone && contactPhone) {
        contactPhone.innerHTML = `<i class="fas fa-phone text-accent" style="margin-right: 10px;"></i> ${data.phone}`;
      }

      if (data.email && contactEmail) {
        contactEmail.innerHTML = `<i class="fas fa-envelope text-accent" style="margin-right: 10px;"></i> ${data.email}`;
      } else if (!data.email && contactEmail) {
        // Hide if no email provided
        contactEmail.style.display = 'none';
      }

      if (data.address && contactAddress) {
        contactAddress.innerHTML = `<i class="fas fa-map-marker-alt text-accent" style="margin-right: 10px;"></i> ${data.address}`;
      }
    })
    .catch(error => {
      console.error("Error loading company details: ", error);
    });
});
// Mobile Menu Toggle
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// Close menu when clicking link (important for UX)
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});