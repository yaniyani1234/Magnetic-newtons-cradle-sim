import numpy as np

arr = np.loadtxt("test.txt", delimiter=",")
pendulum_count = 2
element_count = 2

farr=np.empty(len(arr), dtype=object)

for i in range(len(arr)):
    farr[i]=np.empty(pendulum_count, dtype=object)
    for j in range(element_count):
        farr[i][j]=np.empty(element_count, dtype=float)

for i in range(len(arr)):
    for j in range(element_count*pendulum_count):
        farr[i][j//element_count][j%element_count]=arr[i][j]




import matplotlib.pyplot as plt

y=np.empty(len(arr), dtype=object)
y2=np.empty(len(arr), dtype=object)
e=np.empty(len(arr), dtype=object)
for i in range(len(arr)):
    y[i] = farr[i][0][0] 
    y2[i] = farr[i][0][1] 
    #e[i]= (-np.sin(y[i])*0.05+0.05)*9.81+((y2[i]*0.05)**2)/2








plt.plot(y)
#plt.plot(y2)
plt.xlabel("Index")
plt.ylabel("Value")
plt.title("1D Array Plot")
plt.show()