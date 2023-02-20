document.getElementById("header").innerHTML = `
<!-- Main box -->
<div class="main-box">
    <div class="logo-box">
        <div class="logo"><a href="index.html"><img src="images/logo-3.png" alt="" title=""></a></div>
    </div>

    <!--Nav Box-->
    <div class="nav-outer">
        <nav class="nav main-menu">
            <ul class="navigation" id="navbar">
                <li class="current dropdown">
                    <a href="index.html">Home</a>
                </li>
                <li class="dropdown">
                    <span>Page</span>
                    <ul>
                        <li class="dropdown">
                            <span>Dashboard</span>
                            <ul>
                                <li class="active"><a href="dashboard.html"> Dashboard</a></li>
                                <li><a href="dashboard-profile.html">Profile</a></li>
                                <li><a href="dashboard-listing.html">Listings</a></li>
                                <li><a href="dashboard-messages.html">Messages </a></li>
                                <li><a href="dashboard-reviews.html">Reviews</a></li>
                                
                            </ul>
                        </li>
                        <li><a href="about-us.html">About Us</a></li>
                        <li><a href="how-it-works.html">How It Works</a></li> 
                        <li><a href="listing-style.html">Listing Style</a></li>
                        <li><a href="terms-and-condition.html">Terms and Condition</a></li>
                        <li><a href="elements.html">UI Elements</a></li>
                        <li><a href="error-page.html">Error 404</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <span>Listings</span>
                    <ul>
                        <li class="dropdown">
                            <span>Listing Layout</span>
                            <ul>
                                <li><a href="listing-layout-2.html">Layout 02</a></li>

                            </ul>
                        </li>
                        <li class="dropdown">
                            <span>Listing With Map</span>
                            <ul>

                                <li><a href="listing-map-layout-5.html">Map Layout 05</a></li>
                            </ul>
                        </li>
                       
                    </ul>
                </li>
               
                
                <li><a href="contact.html">Contact</a></li>
                <li class="mm-add-listing"><a href="add-listing.html" class="theme-btn btn-style-three"><span class="flaticon-plus-symbol"></span>Add Listing</a></li>
            </ul>
        </nav>
        <!-- Main Menu End-->

        <div class="outer-box">
            <!-- Add Listing -->
            <a href="add-listing.html" class="add-listing"> <span class="flaticon-plus-symbol"></span> Add Listing</a>

         
            <!-- Login/Register -->
            <div class="login-box"> 
                <span class="flaticon-user"></span> 
                <a href="login.html" class="call-modal">Login</a> or 
                <a href="register.html" class="call-modal">Register </a>
            </div>
        </div>
    </div>
</div>

<!-- Mobile Header -->
<div class="mobile-header">
    <div class="logo"><a href="index.html"><img src="images/logo-3.png" alt="" title=""></a></div>

    <!--Nav Box-->
    <div class="nav-outer clearfix">

        <div class="outer-box">
            <!-- Search Btn -->
            <div class="search-box">
                <button class="search-btn mobile-search-btn"><i class="flaticon-magnifying-glass"></i></button>
            </div>

           

            <!-- Login/Register -->
            <div class="login-box"> 
                <a href="login.html" class="call-modal"><span class="flaticon-user"></span></a>
            </div>
            <a href="#nav-mobile" class="mobile-nav-toggler navbar-trigger"><span class="fa fa-bars"></span></a>
        </div>
    </div>
</div>

<!-- Mobile Nav -->
<div id="nav-mobile"></div>

<!-- Header Search -->
<div class="search-popup">
    <span class="search-back-drop"></span>
    
    <div class="search-inner">
        <button class="close-search"><span class="fa fa-times"></span></button>
        <form method="post" action="https://creativelayers.net/themes/listdo-html/blog-showcase.html">
            <div class="form-group">
                <input type="search" name="search-field" value="" placeholder="Search..." required="">
                <button type="submit"><i class="flaticon-magnifying-glass"></i></button>
            </div>
        </form>
    </div>
</div>
<!-- End Header Search -->`;