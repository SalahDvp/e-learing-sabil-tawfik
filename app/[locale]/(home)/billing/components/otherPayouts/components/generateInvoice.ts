
import { format } from "date-fns";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function downloadInvoice(paymentData:any,id:string,titles:any[],words:any){
    const doc = new jsPDF();
  
    autoTable(doc, {
      body: [
        [
          {
            content: 'school Erp',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#ffffff',
                
            }
          },
          {
            content: words.invoice,
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#ffffff'
            }
          }
        ],
      ],
      theme: 'plain',
      styles: {
        fillColor: '#3366ff'
      }
    });


    let paymentDate = new Date(paymentData.paymentDate);
    if (isNaN(paymentDate.getTime())) {
        console.error('Invalid paymentDate:', paymentData.paymentDate);
        paymentDate = new Date(); // Fallback to current date or handle error as needed
    }

    autoTable(doc, {
      body: [
        [
          {
            content: `ReferenceID #${id}`
            + `\nDate: ${format(paymentDate, 'dd/MM/yyyy')}`,
            styles: {
              halign: 'right'
            }
          }
        ],
      ],
      theme: 'plain'
    });
  
    autoTable(doc, {
      body: [
        [
          {   
            content: words.billedTo
            +`\n${paymentData.toWho}`
            +'\nBilling Address line 1'
            +'\nBilling Address line 2'
            +'\nZip code - City'
            +'\nCountry',
            styles: {
              halign: 'left'
            }
          },
          {
    
            content: words.shippingAddress
            +`\n${paymentData.toWho}`
            +'\nShipping Address line 1'
            +'\nShipping Address line 2'
            +'\nZip code - City'
            +'\nCountry',
            styles: {
              halign: 'left'
            }
          },
          {        
            content:words.fromWho
            +'\nSchool erp'
            +'\nShipping Address line 1'
            +'\nShipping Address line 2'
            +'\nZip code - City'
            +'\nCountry',
            styles: {
              halign: 'right'
            }
          }
        ],
      ],
      theme: 'plain'
    });
  
    autoTable(doc, {
      body: [
        [
          {
            content: words.amount,
            styles: {
              halign:'right',
              fontSize: 14
            }
          }
        ],
        [
          {
            content: `DZD${paymentData.paymentAmount}`,
            styles: {
              halign:'right',
              fontSize: 20,
              textColor: '#3366ff'
            }
          }
        ],
        [
          {
            content: `Status: ${paymentData.status}`,
            styles: {
              halign:'right'
            }
          }
        ]
      ],
      theme: 'plain'
    });
  
    autoTable(doc, {
      body: [
        [
          {
            content: "Description",
            styles: {
              halign:'left',
              fontSize: 14
            }
          }
        ]
      ],
      theme: 'plain'
    });
    const valuesArray:any[] = Object.values(paymentData);
    autoTable(doc, {
      head: [titles],
      body: [
        valuesArray
      ],
      theme: 'striped',
      headStyles:{
        fillColor: '#343a40'
      },
      
    });
  
    autoTable(doc, {
      body: [
        [
          {
            content: words.subtotal,
            styles:{
              halign:'right'
            }
          },
          {
            content: `DZD${paymentData.paymentAmount}`,
            styles:{
              halign:'right'
            }
          },
        ],
        [
          {
            content: words.totalTax,
            styles:{
              halign:'right'
            }
          },
          {
            content: 'DZD0',
            styles:{
              halign:'right'
            }
          },
        ],
        [
          {
            content:words.totalAmount,
            styles:{
              halign:'right'
            }
          },
          {
            content: `DZD${paymentData.paymentAmount}`,
            styles:{
              halign:'right'
            }
          },
        ],
      ],
      theme: 'plain'
    });
  
    autoTable(doc, {
      body: [
        [
          {
            content: "terms and notes",
            styles: {
              halign: 'left',
              fontSize: 14
            }
          }
        ],
        [
          {
            content: 'orem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia'
            +'molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum'
            +'numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium',
            styles: {
              halign: 'left'
            }
          }
        ],
      ],
      theme: "plain"
    });
  
    autoTable(doc, {
      body: [
        [
          {
            content: 'This is a centered footer',
            styles: {
              halign: 'center'
            }
          }
        ]
      ],
      theme: "plain"
    });
  
    return doc.save("invoice");
  
  }
  export function generateBill(paymentData:any,id:string,titles:any[],words:any) {
    const doc = new jsPDF();
  
    autoTable(doc, {
      body: [
        [
          {
            content: 'school Erp',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#ffffff',
                
            }
          },
          {
            content: words.invoice,
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#ffffff'
            }
          }
        ],
      ],
      theme: 'plain',
      styles: {
        fillColor: '#3366ff'
      }
    });
  
    autoTable(doc, {
      body: [
        [
          {
            content: `ReferenceID #${id}`
            +`\nDate: ${format(paymentData.paymentDate, 'dd/MM/yyyy')}`,
            styles: {
              halign: 'right'
            }
          }
        ],
      ],
      theme: 'plain'
    });
  
    autoTable(doc, {
      body: [
        [
          {   
            content: words.billedTo
            +`\n${paymentData.parent}`
            +'\nBilling Address line 1'
            +'\nBilling Address line 2'
            +'\nZip code - City'
            +'\nCountry',
            styles: {
              halign: 'left'
            }
          },
          {
    
            content: words.shippingAddress
            +`\n${paymentData.parent}`
            +'\nShipping Address line 1'
            +'\nShipping Address line 2'
            +'\nZip code - City'
            +'\nCountry',
            styles: {
              halign: 'left'
            }
          },
          {        
            content:words.from
            +'\nSchool erp'
            +'\nShipping Address line 1'
            +'\nShipping Address line 2'
            +'\nZip code - City'
            +'\nCountry',
            styles: {
              halign: 'right'
            }
          }
        ],
      ],
      theme: 'plain'
    });

    const valuesArray:any[] = Object.values(paymentData);
    autoTable(doc, {
      head: [titles],
      body: [
        valuesArray
      ],
      theme: 'striped',
      headStyles:{
        fillColor: '#343a40'
      },
 
      
    });
    autoTable(doc, {
        head: [[
            'Sep 23', 'Oct 23', 'Nov 23', 'Dec 23',
            'Jan 24', 'Feb 24', 'Mar 24', 'Apr 24',
            'May 24', 'Jun 24', 'Jul 24'
          ]],
        body: [
          ["paid","paid","paid"],
        ],
        theme: 'grid',
        headStyles:{
          fillColor: '#E0E0E0',
          textColor:'black'
        },
          didParseCell: function (data) {
           
                data.cell.styles.fontStyle='bold';
                data.cell.styles.textColor='black';
               
            
        }
      });
      autoTable(doc, {

        body: [
          [
            {
              content: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - ',
              styles: {
                halign: 'center',
                fontSize: 20,
                textColor: 'black',
                  
              }
            },
          ],
        ],
        theme: 'plain',
        styles: {
         
        }
      });
      autoTable(doc, {

        body: [
          [
            {
              content: 'school Erp',
              styles: {
                halign: 'left',
                fontSize: 20,
                textColor: 'black',
                  
              }
            },
            {
              content: words.invoice,
              styles: {
                halign: 'right',
                fontSize: 20,
                textColor: 'black'
              }
            }
          ],
        ],
        theme: 'plain',
        styles: {
         
        }
      });
    
      autoTable(doc, {
        body: [
          [
            {
              content: `ReferenceID #${id}`
              +`\nDate: ${format(paymentData.paymentDate, 'dd/MM/yyyy')}`,
              styles: {
                halign: 'right'
              }
            }
          ],
        ],
        theme: 'plain'
      });
    
      autoTable(doc, {
        body: [
          [
            {   
              content: words.billedTo
              +`\n${paymentData.parent}`
              +'\nBilling Address line 1'
              +'\nBilling Address line 2'
              +'\nZip code - City'
              +'\nCountry',
              styles: {
                halign: 'left'
              }
            },
            {
      
              content: words.shippingAddress
              +`\n${paymentData.parent}`
              +'\nShipping Address line 1'
              +'\nShipping Address line 2'
              +'\nZip code - City'
              +'\nCountry',
              styles: {
                halign: 'left'
              }
            },
            {        
              content:words.from
              +'\nSchool erp'
              +'\nShipping Address line 1'
              +'\nShipping Address line 2'
              +'\nZip code - City'
              +'\nCountry',
              styles: {
                halign: 'right'
              }
            }
          ],
        ],
        theme: 'plain'
      });

      autoTable(doc, {
        head: [titles],
        body: [
          valuesArray
        ],
        theme: 'striped',
        headStyles:{
          fillColor: '#343a40'
        },
   
        
      });
      autoTable(doc, {
          head: [[
              'Sep 23', 'Oct 23', 'Nov 23', 'Dec 23',
              'Jan 24', 'Feb 24', 'Mar 24', 'Apr 24',
              'May 24', 'Jun 24', 'Jul 24'
            ]],
          body: [
            ["paid","paid","paid"],
          ],
          theme: 'grid',
          headStyles:{
            fillColor: '#E0E0E0',
            textColor:'black'
          },
            didParseCell: function (data) {
             
                  data.cell.styles.fontStyle='bold';
                  data.cell.styles.textColor='black';
                 
              
          }
        });
    return doc.save("invoice");
}