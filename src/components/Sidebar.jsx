import React, { useEffect, useRef, useState } from 'react';
import './Sidebar.scss';
import gsap from 'gsap';

export default function Sidebar() {
  const sidebar = useRef();
  const sidebarBody = useRef();
  const toggle = useRef();
  const [show, setShow] = useState(true);

  function toggleSidebar() {
    // Hide
    if (show) {
      gsap.to(sidebarBody.current, {
        duration: 0.8,
        x: -260,
        ease: 'power2.inOut'
      });
      gsap.to(toggle.current, {
        duration: 0.8,
        x: -260,
        rotation: -180,
        ease: 'power2.inOut',
        // css: {
        //   transform: 'rotate(Math.PI)'
        // }
      });
      setShow(false)
    }

    // Unhide
    if (!show) {
      gsap.to(sidebarBody.current, {
        duration: 0.8,
        x: 0,
        ease: 'power2.inOut'
      });
      gsap.to(toggle.current, {
        duration: 0.8,
        x: 0,
        rotation: 0,
        ease: 'power2.inOut'
      });
      setShow(true)
    }
  }

  // Show on initial mount
  useEffect(() => {
    gsap.to(sidebar.current, {
      duration: 1,
      opacity: 1,
      delay: 1,
    });
  }, [sidebar]);

  return (
    <div className="sidebar" ref={sidebar}>
      {/* TOGGLE */}
      <div className="sidebarToggle" ref={toggle} onClick={toggleSidebar}>
        {/* <p>&larr;</p> */}
        <p>{'<'}</p>
      </div>

      {/* BODY */}
      <div className="sidebarBody" ref={sidebarBody}>
        {/* CONTENT */}
        <div className="sidebarHeader">
          <h3 className="sidebarHeaderText">R3F Journey</h3>
        </div>
        <div className="sidebarMain"></div>
      </div>
    </div>
  );
}
