#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <stdbool.h>

#define BUFFER_SIZE 1024
/*
	boundary of multipart/form-data is not excess 70 bytes
*/


/*
	return a pointer point to located substring and new dataSize, 
	we can remove dataSize parameter from list due to this can be calculated
	outside when we get located newBuffer.
*/
char* clearHeader(const char* buffer, unsigned short *dataSize)
{
	/*
	we can not free newBuffer due to newBuffer will point to an array or
	NULL
	*/
	
	char* newBuffer = strstr(buffer, "\r\n\r\n") + strlen("\r\n\r\n");
	if(newBuffer)
	{
		if(*dataSize != 0)
		{
			*dataSize = *dataSize - (unsigned short)(newBuffer - buffer);
		}
		else
		{
			*dataSize = BUFFER_SIZE - (unsigned short)(newBuffer - buffer);
		}
	}
	return newBuffer;
}


/*
	return new data size
*/

unsigned short clearFooter(const char* buffer, unsigned short dataRead)
{
	unsigned short oldDataRead = dataRead;
	unsigned short dataSize = 0;
	while(buffer[dataRead - 2] != 10)
	{
		dataRead --;
		if(dataRead <= 0)
		{
			//error
			break;
		}
	}
	////buffer[dataRead - 3 ] = '\0';
	/*
		due to dataRead -- in last loop
		is go back over one '\n'
	*/
	dataSize = (unsigned short)(oldDataRead - (oldDataRead - dataRead) - strlen("\r\n\r"));
	return dataSize;
}



int main()
{


	char* newBuffer = NULL;
	

	char* length = NULL;
	int len = 0;
	unsigned short dataSize = 0;
	bool isFirstReadTime = true;
	
	char buffer[BUFFER_SIZE] = {0};
	
	FILE *file = NULL;


	length = (char*)malloc(10);

	if(length == NULL)
	{
		printf("allocate for length var failed\n");
		goto skipLength;
	}
	
	length = getenv("CONTENT_LENGTH");
	len = atoi(length);	
	if(length == NULL)
	{
		printf("get CONTENT_LEGNTH var failed\n");
		goto skipLength;
	}

skipLength:
	file = fopen("/home/orangepi/Desktop/Apache2ServerFolder/storage.txt", "wb");
	do
	{
		//move newBuffer to origin position when use memset to it
		if(len < BUFFER_SIZE)                                                          
        {
			/*
			current problem: read can not read 00 (binary format),
			Note:
			in linux, default stdin open in binary mode (always open)
			status: not resolve->resolved by using dataSize instead of strlen() function
			due to strlen will be stop when get 0x00 value in spite of not get end of
			buffer
			*/
			fread(buffer, 1, len, stdin);
			if(len > 70)
			{
				dataSize = 0;
				dataSize = clearFooter(buffer, len);
				newBuffer = buffer;
				if(isFirstReadTime)
				{
					isFirstReadTime = false;
					
					//clear header boundary
					newBuffer = clearHeader(buffer, &dataSize);
				}

				fwrite(newBuffer, 1, dataSize, file);
			}
			len = 0;
        }
        else
        {
            //read(STDIN_FILENO, buffer, BUFFER_SIZE);
            fread(buffer, 1, BUFFER_SIZE, stdin);
            len -= BUFFER_SIZE;
			if(isFirstReadTime)
			{
				isFirstReadTime = false;
				newBuffer = clearHeader(buffer, &dataSize);
				fwrite(newBuffer, 1, dataSize, file);
			}
			else
			{
				if(len <= 70)
				{
					dataSize = clearFooter(buffer, BUFFER_SIZE);
					newBuffer = buffer;
					fwrite(newBuffer, 1, dataSize, file);
				}
				else
				{
					fwrite(buffer, 1, BUFFER_SIZE, file);
				}
			}

            memset(buffer, 0x00, BUFFER_SIZE);
        }
	}
	while(len > 0);
	fclose(file);

	//convert dos format to unix format (.txt format)
	//system("dos2unix /home/orangepi/Desktop/Apache2ServerFolder/storage.txt");

	/*
	to responseable when not read data from stdin buffer, send Content-Type twice
	*/
	printf("Content-Type:text/plain\r\n\r\n");
	/*
	free(buffer); //cause segment in case buffer is pointer and apply memset to it
	*/
	return 0;
}

