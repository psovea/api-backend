                                                                                                                                                            
                                                                                                                                                            
                                                                                                                                                            
           DELAY                                       VERTREK VAN EEN RIT WORDT UITGESTELD/ VERTRAGING BIJ AANVANG RIT                                    
                      dataownercode                    vervoerder/exploitant                                                                                
                      lineplanningnumber               lijn zoals gebruikt in het systeem van de vervoerder                                                 
                      operatingday                     exploitatiedag                                                                                       
                      journeynumber                    publieke ritnummer zoals bekend bij de vervoerder                                                    
                      reinforcementnumber              versterkingsrit indicator, 0 = geplande rit, > 0 = versterkingsrit                                   wat is een versterkingsrit?
                      timestamp                        tijdstip van verzenden bericht door het bronsysteem (van het vervoer)                                
                      source                           de onderliggende bron van het bericht                                                                wat is de onderliggende bron/ SERVER NIET NODIG
                      punctuality                      verwachte afwijking op de geplande tijd in seconden ten opzichte van het beginpunt. < 0 = te vroeg, >
           INIT                                        ER VINDT EEN KOPPELING PLAATS TUSSEN VOERTUIG EN RIT                                               
                      dataownercode                                                                                                                         
                      lineplanningnumber                                                                                                                    
                      operartingdate                                                                                                                        
                      journeynumber                                                                                                                         
                      reinforcementnumber                                                                                                                   
                      timestamp                                                                                                                             
                      source                                                                                                                                
                      userstopcode                     haltenummer van de actuele beginhalte (kan anders zijn dan gepland)                                  
                      passagesequencenumber            passagenummer horende bij de userstopcode (hoe vaak ben je de halte gepasseerd                       
                      vehiclenumber                    voertuigidentificatienummer                                                                          
                      blockcode                        Identificeert een wagendienst / omloop van een vervoerder.  -> niet nodig                                    
                      wheelchairaccessible             rolstoeltoegankelijk                                                                                 
                      number of coaches                aantal rijtuigen                                                                                     
           ARRIVAL                          	       GEEFT AAN DAT ER GEHALTEERD IS                                                   
                      dataownercode                                                                                                                         
                      lineplanningnumber                                                                                                                    
                      operatingday                                                                                                                          
                      journeynumber                                                                                                                         
                      reinforcementnumber                                                                                                                   
                      userstopcode                     haltenummer van de halte waarop gearriveerd wordt                                                    
                      passagesequencenumber                                                                                                                 
                      timestamp                                                                                                                             
                      source                                                                                                                                
                      vehiclenumber                                                                                                                         
                      punctuality                      afwijking op geplande aankomsttijd in seconden                                                       
                      delimiter                                                                                                                             
                                            Rd-x       RDS in meters, afwezig als onbekend -1 -> coordinaten van de halte                                               
                                            Rd-y       RDS in meters, afwezig als onbekend -1                                                                 
           ONSTOP                                      WORDT VERSTUURD ZOLANG ER GEHALTEERD IS (DAN GEEN ONRUITE)                                             
                      dataownercode                                                                                                                         
                      lineplanningnumber                                                                                                                    
                      operatingday                                                                                                                          
                      journeynumber                                                                                                                         
                      reinforcementnumber                                                                                                                   
                      userstopcode                     haltenummer waarop gearriveerd wordt                                                                 
                      passagesequencenumber                                                                                                                 
                      timestamp                                                                                                                             
                      source                                                                                                                                
                      vehiclenumber                                                                                                                         
                      punctuality                      Actuele afwijking op de geplande vertrektijd in seconden                                             
                      delimiter                                                                                                                             
                                            Rd-x                                                                                                            
                                            Rd-y                                                                                                            
           DEPARTURE                                   GEEFT AAN DAT ER VERTROKKEN IS VAN DE HALTE                                                          
                      dataownercode                                                                                                                         
                      lineplanningnumber                                                                                                                    
                      operatingday                                                                                                                          
                      journeynumber                                                                                                                         
                      reinforcementnumber                                                                                                                   
                      userstopcode                     haltenummer waarvan vertrokken wordt of gepasseerd wordt                                             
                      passagesequencenumber                                                                                                                 
                      timestamp                                                                                                                             
                      source                                                                                                                                
                      vehiclenumber                                                                                                                         
                      punctuality                      Actuele afwijking op de geplande vertrektijd op deze halte.                                          
                      delimiter                                                                                                                             
                                            Rd-x                                                                                                            
                                            Rd-y                                                                                                            
           ONROUTE                                     GEEFT POSITIE MET STIPTHEID                                                                          
                      dataownercode                                                                                                                         
                      lineplanningnumber                                                                                                                    
                      operatingday                                                                                                                          
                      journeynumber                                                                                                                         
                      reinforcementnumber                                                                                                                   
                      userstopcode                     Haltenummer van de laatst bekende halte                                                              
                      passagesequencenumber                                                                                                                 
                      timestamp                                                                                                                             
                      source                                                                                                                                
                      vehiclenumber                                                                                                                         
                      punctuality                      Actuele afwijking op de geplande tijd in seconden ten opzichte van het eerstvolgende tijdpunt op de geplande route
                      distancesincelastusers           Afstand vanaf laatst gepasseerde halte in meters                                                     
                      Rd-x                             RDS in meters -1 als onbekend                                                                        
                      Rd-y                             RDS in meters -1 als onbekend                                                                        
           OFFROUTE                                    GEPLANDE ROUTE WORDT NIET MEER GEVOLGD, GEEFT HUIDIGE POSITIE                                                
                      dataownercode                                                                                                                         
                      lineplanningnumber                                                                                                                    
                      operatingday                                                                                                                          
                      journeynumber                                                                                                                         
                      reinforcementnumber                                                                                                                   
                      timestamp                                                                                                                             
                      source                                                                                                                                
                      userstopcode                     Haltenummer van de laatst aangedane halte                                                            
                      passagesequencenumber                                                                                                                 
                      vehiclenumber                                                                                                                         
                      Rd-x                                                                                                                                  
                      Rd-y                                                                                                                                  
           END                                         GEEFT AAN DAT VOERTUIG EN RIT ONTKOPPELD ZIJN                                                        
                      dataownercode                                                                                                                         
                      lineplanningnumber                                                                                                                    
                      operatingday                                                                                                                          
                      journeynumber                                                                                                                         
                      reinforcementnumber                                                                                                                   
                      timestamp                                                                                                                             
                      source                                                                                                                                
                      userstopcode                     Haltenummer van de laatst aangedane halte                                                            
                      passagesequencenumber                                                                                                                 
                      vehiclenumber                                                                                                                         
