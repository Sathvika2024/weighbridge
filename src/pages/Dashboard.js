import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import jsPDF from 'jspdf';
import { Card, Stack, Grid, CardContent, Typography, Slide } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { triggerCamera } from '../network/weighBridge';
import Page from '../components/Page';
import { useAuth } from '../components/customContextProviders/AuthContext';
import AlertDialog from '../components/AlertDialog';
import { APP_CONSTANTS } from '../URLConstants';
import AddVehicleModal from '../components/AddVehicleModal';


const cardStyle = {
    width: "100%",
    borderRadius: "16px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9fafb",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
    },
}
const numberPlateStyle = { 
    textAlign: 'center', 
    fontSize: '18px', 
    fontWeight: 700, 
    fontFamily: 'Courier New, monospace', 
    lineHeight: 1.2, 
    letterSpacing: '2px', 
    textTransform: 'uppercase', 
    pt:1
  }

const weighingName = { 
    textAlign: 'center', 
    fontSize: '20px', 
    fontWeight: 700, 
    fontFamily: 'Arial, sans-serif', 
    lineHeight: 1.4, 
    letterSpacing: '1px', 
    textTransform: 'uppercase', 
    color: '#2C3E50',
  }

const weightstyle = { 
    textAlign: 'center', 
    fontSize: '20px', 
    fontWeight: 700, 
    lineHeight: 1.2, 
    color: '#2C3E50', // Dark color for contrast
    fontFamily: "'Digital-7 Mono', monospace'", 
    marginLeft: 1,
  }

export default function Dashboard () {
    const [timestamp, setTimestamp] = useState({ date: null, time: null });
    const [ slide, setSlide ] = useState(false)
    const {sessionUserData} = useAuth();
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [messages, setMessages] = useState({mqttMessage: {}, triggerRequestId:{}, processedResult:{}, processedError:{}, loading:false, roll: false})
    const [open, setOpen] = useState(false);

  const [openAlertDialog, setOpenAlertDialog] = useState(false)
  const [alertDialogMetas, setAlertDialogMetas] = useState({
    message: "",
    title: "",
    btnLabel: "",
  });


      useEffect(() => {
        // Connect to the MQTT broker as soon as the page loads
        const mqttClient = mqtt.connect(APP_CONSTANTS?.MQTT_BROKER_URL);

        mqttClient.on("connect", () => {
            console.log("Connected to WebSocket broker");
            setIsConnected(true);
            setClient(mqttClient);

            // Automatically subscribe to a topic upon connection
            const topic = "frontend/1/events";
            mqttClient.subscribe(topic, (err) => {
                if (err) {
                    console.log(`Subscription failed: ${err}`);
                } else {
                    console.log(`Subscribed to topic: ${topic}`);
                    setIsSubscribed(true);
                }
            });
        });

        mqttClient.on("message", (topic, message) => {
            const mqttResponse = JSON.parse(message.toString())

            console.log(mqttResponse)

            if (mqttResponse?.message === 'Image uploaded') {
                
                setMessages((prevMessage) => ({
                    ...prevMessage,
                    mqttMessage: mqttResponse,
                }));
            } 
            else if (mqttResponse?.message === 'Image Processed') {

                setMessages((message)=> ({
                    ...message,
                    processedResult: mqttResponse,
                    loading:true,
                    roll:false
                }))
            } else {
                setMessages((message)=> ({
                    ...message,
                    processedError: mqttResponse,
                    roll:false
                }))
            setAlertDialogMetas({ ...alertDialogMetas, message: mqttResponse?.errorMessage, title: mqttResponse?.message, btnLabel: "OK" });
            setOpenAlertDialog(true)
            }            
        });
        // Cleanup function to disconnect the client when the component unmounts
        return () => {
            if (mqttClient) {
                mqttClient.end();
                console.log("Disconnected from WebSocket broker");
            }
        };
    }, []); // Empty dependency array ensures this runs only once when the component mounts


    function handleCaptureButton() {
        setMessages((messages)=>({
            ...messages,
            roll: true,
        }))
        triggerCamera(1).then((res)=>{
            setMessages((message)=>({
                ...message,
                triggerRequestId: res?.data?.requestId
            }))
        });
        const currentDate = new Date().toLocaleDateString(); // Format the date (MM/DD/YYYY)
        const currentTime = new Date().toLocaleTimeString(); // Format the time (HH:MM:SS AM/PM)
        setTimestamp({ date: currentDate, time: currentTime });
        setSlide(true)
    }


      function getStatusFromMessages() {
        const tareWeight = messages?.processedResult?.detectionResult?.result?.tareWeight;
        const grossWeight = messages?.processedResult?.detectionResult?.result?.grossWeight;
        const netWt = messages?.processedResult?.detectionResult?.result?.netWeight;
      
        if (tareWeight && !grossWeight && !netWt) {
          return "ENTRY";
        } else if (tareWeight && grossWeight && netWt) {
          return "EXIT";
        } 
      
        return "UNKNOWN"; // Fallback for incomplete or missing data
      }



    function downloadPdfReport() {
        const doc = new jsPDF();
        const logoUrl = 'https://i.postimg.cc/FKLr13w7/logo.png';
      
        const img = new Image();
        img.src = logoUrl;
        img.onload = function () {
          // Add the logo (X: 10, Y: 5, Width: 15, Height: 15)
          doc.addImage(img, 'PNG', 10, 5, 10, 10);
          // Add the title next to the logo (aligned properly)
          doc.setFont('Helvetica', 'bold');
          doc.text(22, 11, 'Weighing Station Report'); // X: 30 to leave space for the logo
      
          // Draw a border around the content
          doc.rect(5, 20, 200, 135); // X, Y, Width, Height
      
          // Report content inside the box
          doc.setFont('Mulish', 'normal');
          doc.text(10, 30, `Weighing Station: ${messages?.processedResult?.detectionResult?.result?.weighingStation?.name || 'NA'}`);
          doc.text(10, 40, `Organization: ${messages?.processedResult?.detectionResult?.result?.organization?.name || 'NA'}`);
          doc.text(10, 50, '--------------------------------------');
          doc.text(10, 60, 'WEIGHT STATS:');
          doc.text(10, 70, `Tare Weight: ${messages?.processedResult?.detectionResult?.result?.tareWeight || 'NA'}`);
          doc.text(10, 80, `Gross Weight: ${messages?.processedResult?.detectionResult?.result?.grossWeight || 'NA'}`);
          doc.text(10, 90, `Net Weight: ${messages?.processedResult?.detectionResult?.result?.netWeight || 'NA'}`);
          doc.text(10, 100, `Status: ${getStatusFromMessages()}`);
          doc.text(10, 110, '--------------------------------------');
          doc.text(10, 120, `Number Plate: ${messages?.processedResult?.detectionResult?.result?.numberPlate || 'NA'}`);
          doc.text(10, 130, `Driving License No.: ${messages?.processedResult?.detectionResult?.result?.vehicle?.drivingLicenseNumber || 'NA'}`);
          doc.text(10, 140, `Driver Name: ${messages?.processedResult?.detectionResult?.result?.vehicle?.driverName || 'NA'}`);
          doc.text(10, 150, `Time Stamp: ${timestamp?.time || 'NA'}`);
      
          // Save the report
          doc.save('weighing-station-report.pdf');
        };
      }
      
      
    function handleButtonClick() {
    // 1. Download the PDF report
        downloadPdfReport();
        handleOpenGate();


    }

    function handleOpenGate(){
        const client = mqtt.connect(APP_CONSTANTS?.MQTT_BROKER_URL); // Replace with your MQTT server and port
            const topic = 'rpi/1/trigger';
            const payload = JSON.stringify({ action: 'open_entry_exit_gate' });

            client.on('connect', () => {
            console.log('Connected to MQTT publish broker');
            client.publish(topic, payload, (err) => {
                if (err) {
                console.error('Failed to publish message:', err);
                } else {
                console.log(`Message published to ${topic}:`, payload);
                }
                client.end(); // Close the connection after publishing
            });
            });

            client.on('error', (err) => {
            console.error('MQTT connection error publish:', err);
            });
    }
      
    return(
    <Page>       
          <Grid
            container
            justifyContent="flex-start"
            alignItems="flex"
            style={{ height: "100vh" }}
        >
            
            <Grid item xs={12} md={4} pb={2}>
                <LoadingButton
                    loading={messages?.roll}
                    width='50%'
                    size="medium"
                    type="submit"
                    variant="contained"
                    onClick={handleCaptureButton}
                    sx={{ pt: 1, pb:1, backgroundColor:'#171d40', borderRadius:'10px',
                        '&:hover': {
                            backgroundColor: '#007b55',
                            },
                }}>
                    Capture
                </LoadingButton> 
                <LoadingButton
                    width='50%'
                    size="medium"
                    type="submit"
                    variant="contained"
                    onClick={() => setOpen(true)}
                    sx={{ pt: 1, ml:2, backgroundColor:'#171d40', pb:1, borderRadius:'10px',
                    '&:hover': {
                        backgroundColor: '#007b55', // Keep the same color on hover
                        },
                }}>
                    Add Vehicle
                </LoadingButton>
                <LoadingButton
                    width='50%'
                    size="medium"
                    type="submit"
                    variant="contained"
                    onClick={() => handleOpenGate()}
                    sx={{ pt: 1, ml:2, backgroundColor:'#171d40', pb:1, borderRadius:'10px',
                    '&:hover': {
                        backgroundColor: '#007b55', // Keep the same color on hover
                        },
                }}>
                    LIFT GATE-2
                </LoadingButton> 
                {!messages?.loading &&
                <LoadingButton
                    width='50%'
                    size="medium"
                    type="submit"
                    variant="contained"
                    onClick={handleButtonClick}
                    sx={{ pt: 1, pb:1, ml:2, backgroundColor:'#f0f0f0', color:'black', borderRadius: '10px', 
                        '&:hover': {
                            backgroundColor: '#171d40',
                            color: 'white', // Keep the same color on hover
                        },
                        }}>
                    Print
                </LoadingButton>
}
                <Stack alignItems="flex-start" direction='column' spacing={2}>
                <Slide in={slide} direction="up" timeout={1000}>
                    <Card
                        sx={{...cardStyle, ml:10, pt:2}}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: "#1f2937",
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                                gutterBottom
                            >
                                Captured Image:
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontFamily: "'Digital-7 Mono', sans-serif",
                                    color: "#53bce9", // Red text
                                    fontWeight: "bold",
                                    lineHeight: 1,
                                    fontSize: "2.5rem",
                                }}
                            >
                                {messages?.mqttMessage?.downloadUrl && (
                                        <img
                                            src={messages?.mqttMessage?.downloadUrl}
                                            alt="MQTT"
                                            style={{ maxWidth: "100%", height: "auto" }}
                                        />
                                )}                            
                            </Typography>
                        </CardContent>
                    </Card>
                </Slide>

                </Stack>
            </Grid>

            {/* Capture Card */}
            <Grid item xs={12} md={4} ml={2}>
                <Stack alignItems="flex-start">
                    <Card sx={cardStyle}>
                       
                        <Stack alignItems="center" direction={'row'}>
                            <Grid item xs={6} sm={6} md={12} p={2} spacing={2} direction={'row'}>
                            <Typography sx={{ textAlign: 'left', fontSize:'16px', fontWeight: 600, lineHeight:0.5 }}>WEIGHING STATION</Typography>
                            </Grid>    
                            <Grid item xs={6} sm={6} md={12} p={2} spacing={2} direction={'row'}>
                            <Typography sx={weighingName}>{messages?.processedResult?.detectionResult?.result?.weighingStation?.name}</Typography>
                            </Grid>                          
                        </Stack>
                        <Stack alignItems="center" direction={'row'}>
                        <Grid item xs={6} sm={6} md={12} p={2} spacing={2} direction={'row'}>
                            <Typography sx={{ textAlign: 'left', fontSize:'16px', fontWeight: 600, lineHeight:0.5 }}>ORGANIZATION</Typography>
                            </Grid>    
                            <Grid item xs={6} sm={6} md={12} p={2} spacing={2} direction={'row'}>
                            <Typography sx={weighingName}>{messages?.processedResult?.detectionResult?.result?.organization?.name} </Typography>
                            </Grid>                            
                        </Stack>
                        </Card>
                        <Card sx={{...cardStyle, mt:1}}>
                            <Typography
                                sx={{
                                cursor: 'pointer',
                                fontFamily: "'Digital-7 Mono', sans-serif",
                                fontSize: 18,
                                fontWeight: 700,
                                p:2,
                                color: '#16A085' // Teal
                                }}
                            >
                                WEIGHT STATS
                            </Typography>
                            <Stack alignItems="center" direction={'row'}>

                                <Grid item xs={6} sm={6} md={4} p={2}>
                                    <Typography sx={{ textAlign: 'center', fontSize:'16px', fontWeight: 600, lineHeight:0.5,mb:1 }}>TARE Wt.</Typography>
                                    <Typography sx={weightstyle}>{messages?.processedResult?.detectionResult?.result?.tareWeight || 'NA'}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={4} p={2}>
                                    <Typography sx={{ textAlign: 'center', fontSize:'16px', fontWeight: 600, lineHeight:0.5, mb:1 }}>GROSS Wt.</Typography>
                                    <Typography sx={weightstyle}>{messages?.processedResult?.detectionResult?.result?.grossWeight || 'NA'}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={4} p={2}>
                                    <Typography sx={{ textAlign: 'center', fontSize:'16px', fontWeight: 600, lineHeight:0.5, mb:1 }}>NET Wt.</Typography>
                                    <Typography sx={weightstyle}>{messages?.processedResult?.detectionResult?.result?.netWeight || 'NA'}</Typography>
                                </Grid>
                            </Stack>
                        </Card>
                        <Card sx={{...cardStyle, mt:2}}>
                        <Stack alignItems="center" direction={'row'}>

                        <Grid item xs={6} sm={6} md={6} p={2}>
                        <Typography
                            sx={{
                                textAlign: 'center',
                                fontSize: '20px',
                                fontWeight: 600,
                                lineHeight: 1,
                                color: '#333',
                            }}
                            >
                            STATUS
                            </Typography> 
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} p={2}>
                            <Typography
                            sx={{
                                fontSize: '20px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: (getStatusFromMessages() === 'ENTRY' ? '#27AE60' : '#C0392B'), // Green for ENTRY, Red for EXIT
                            }}
                            >
                                {getStatusFromMessages()}
                            </Typography>                               
                        </Grid>
                        </Stack>
                        </Card>

                    
                </Stack>
            </Grid>


            {/* Timestamp Card 2 */}
            <Grid item xs={12} md={3.4} ml={4}>
                <Card sx={cardStyle}>
                        <Stack alignItems="flex-start" direction={'row'}>
                            <Grid item xs={6} sm={6} md={6} p={2} spacing={0.5} direction={'row'}>
                            <Typography sx={{ textAlign: 'left', fontSize:'16px', fontWeight: 600, lineHeight:0.5 }}>NUMBER PLATE</Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} direction={'row'}>
                            <Typography sx={{...numberPlateStyle, color: 'red',}}> {messages?.processedResult?.detectionResult?.result?.numberPlate} </Typography>
                            </Grid>
                            
                        </Stack>
                        <Stack alignItems="flex-start" direction={'row'}>
                            <Grid item xs={6} sm={6} md={6} p={2} spacing={0.5} direction={'row'}>
                            <Typography sx={{ textAlign: 'left', fontSize:'16px', fontWeight: 600, lineHeight:0.5 }}> DRIVING LICENSE NO.</Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} direction={'row'}>
                            <Typography sx={{...numberPlateStyle, color: 'red',}}> {messages?.processedResult?.detectionResult?.result?.vehicle?.drivingLicenseNumber} </Typography>
                            </Grid>
                            
                        </Stack>
                        <Grid item xs={6} sm={6} md={12} p={2}>
                            <Typography sx={{...numberPlateStyle, color: '#333'}}> {messages?.processedResult?.detectionResult?.result?.vehicle?.driverName}</Typography>
                            {messages?.processedResult?.detectionResult?.result?.vehicle?.driverImage && (
                                        <img
                                            src={messages?.processedResult?.detectionResult?.result?.vehicle?.driverImage}
                                            alt="DriverIm"
                                            style={{ maxWidth: "100%", height: "auto" }}
                                        />
                                )} 
                            </Grid>
                        </Card>
            </Grid>
        </Grid>
        <AddVehicleModal open={open} onClose={() => setOpen(false)} />

        <AlertDialog openAlertDialog={openAlertDialog} message={alertDialogMetas?.message} title={alertDialogMetas?.title}
        btnLabel={alertDialogMetas?.btnLabel} handleClose={() => setOpenAlertDialog(false)} />
    </Page>
    )
}