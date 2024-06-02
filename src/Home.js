import DashboardTemplate from './Dashboard/DashboardTemplate'
import Sidebar from './Dashboard/components/SIdebar'
import React, { useContext, useEffect, useState } from 'react'
import CssBaseline from '@mui/joy/CssBaseline';
import { useNavigate } from 'react-router-dom'
import { Box, Card, Typography } from '@mui/joy'
import Header from './Dashboard/components/Header';
import AuthContext from './AuthContext';
import Input from '@mui/joy/Input';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/joy/Button';
import { db } from './firebase.js';
import DoctorsList from './DoctorsList.js';
import { collection, query, where, getDocs } from "firebase/firestore";
import IconButton from '@mui/material/IconButton'; // Import IconButton for arrows
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'; // Import ArrowBackIosIcon for previous slide
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // Import ArrowForwardIosIcon for next slide
import SimpleSlider from './slider.js';


//import care from './Resources/care.png'

const Home = () => {
  const { user } = useContext(AuthContext)
  const { userData, setUserData } = useContext(AuthContext)
  const [showDoctorsList, setShowDoctorsList] = useState(false);
  const [doctorSearchKeyword, setDoctorSearchKeyword] = useState();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tips, setTips] = useState([]); // Array to store fetched tips
  const topicsList = [
    { name: "Anxiety", slug: '/anxiety' },
    { name: "Depression", slug: '/depression' },
    { name: "Stress", slug: '/stress' },
    { name: "Trauma", slug: '/trauma' }]

  const handleShowDoctorsList = () => {
    setShowDoctorsList(!showDoctorsList);
    if (showDoctorsList === false) {
      setShowDoctorsList(true)
    }
    console.log(doctorSearchKeyword)

  };

  const handleSearchChange = (event) => {
    setDoctorSearchKeyword(event.target.value.toLowerCase()); // Lowercase for case-insensitive search
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    //getting the tips from database
    const fetchTips = async () => {
      const tipsCollection = collection(db, "Tips");
      const tipsSnapshot = await getDocs(tipsCollection);
      const fetchedTips = tipsSnapshot.docs.map((doc) => doc.data().text);
      setTips(fetchedTips);
      console.log(tips)
    };

    fetchTips();
  }, [])

  let navigate = useNavigate();

  //setting the card style  
  const cards = {
    aspectRatio: '1/1',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
    borderRadius: '4px',
    marginBottom: '20px',
    height: '300px',
    width: '450px'
  };


  //scrolling to the next slide by the use of arrows
  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % tips.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + tips.length) % tips.length); // Handle negative modulo
  };

  const cardStyle = {
    backgroundColor: '#bbea93',
    color: 'black',
    boxShadow: '0 0 25px 0 #0001',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    margin: '10px',
    width: '250px',
    borderRadius: '15px',
    border: 0,
    padding: '35px 15px'
  };



  return (
    <div>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100dvh', background: '#f5f5f5' }}>
        <Sidebar />
        <Header />
        <Box //main
          component="main"
          className="MainContent"
          sx={{
            boxSizing: 'border-box',
            backdropFilter: 'blur(22px)',
            pt: { xs: 'calc(25px + var(--Header-height)) !important', md: 3 },
            padding: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            columnGap: 0,
            gap: { md: 1, xs: 3 },
            overflow: 'auto',
            justifyContent: { md: 'space-between', xs: 'flex-start' },
            alignItems: { md: 'flex-start', xs: 'center' },
            alignContent: 'flex-start',
            flexWrap: 'no-wrap',

          }}>
          <Box //Hero
            sx={{//the hero section style (:'( ))
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              background: '#2c554b',
              color: '#f0f4f4',
              padding: { lg: '25px', md: '10px 25px' },
              minHeight: { lg: '30dvh', md: '15dvh' },
              borderRadius: '15px',
              position: 'relative',
              top: 0,
              left: 0,
              width: '100%',

              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              textAlign: 'left',
              zIndex: 1,
            }}>
            <Typography level='h1' sx={{ color: '#f0f1f1' }}>Welcome {userData.fullName ? userData.fullName : "Laiba"} !</Typography>
            <Typography variant="h5" sx={{ color: '#f0f1f1', fontSize: '22px' }}>Great to have you on board!</Typography>
            <Typography variant="body1" sx={{ color: '#f0f1f1', fontSize: '22px' }}>You're not alone :) Own your journey.</Typography>
            <Input
              sx={{ position: 'absolute', right: '25px', top: '25px' }}
              startDecorator={<SearchIcon color='success' />}
              color=""
              placeholder="Search anything.."
              size="lg"
              variant="outlined"

            />


          </Box>
          <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <SimpleSlider data={tips} />
          </Box>

          <Box //Explore Topics
            sx={{ display: 'flex', flexDirection: 'column', gap: 0, padding: '15px', width: '100%' }}
          >
            <h2 style={{ color: '#272727', marginBottom: '10px', fontFamily: 'Montserrat' }}>
              Explore Topics
            </h2>
            <Box sx={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
              {topicsList.map(topic => (
                <Card sx={cardStyle} >
                  < Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 'bold', color: '#272727dd' }}>{topic.name}</Typography>
                </Card>
              ))}
            </Box>
          </Box>
        </Box >


      </Box>




    </div >
  );
}

export default Home