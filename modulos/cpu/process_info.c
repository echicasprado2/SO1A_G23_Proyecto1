#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/sched/signal.h>
#include <linux/sched.h>
#include <linux/mm.h>

char buffer[256];
struct task_struct *task;
struct task_struct *task_child;
struct list_head *list;
struct sysinfo inf;


char * get_task_state(long state){
    switch (state)
        {
        case TASK_RUNNING:
            return "Ejecucion";
            
        case TASK_INTERRUPTIBLE:
            return "Suspendido";
            
        case TASK_UNINTERRUPTIBLE:
            return "Suspendido";

        case __TASK_STOPPED:
            return "Suspendido";
            
        case __TASK_TRACED: 
            return "Detenido";
            
        case TASK_STOPPED:
            return "Detenido";
            
        case EXIT_ZOMBIE:
            return "Zombie";
                
        default:
            sprintf(buffer, "Desconocido %ld", state);
            return buffer;
        }
}

int get_task_state_id(long state){
    switch (state)
        {
        case TASK_RUNNING:
            return 0;
        case TASK_INTERRUPTIBLE:
            return 1;
        case TASK_UNINTERRUPTIBLE:
            return 1;
        case __TASK_STOPPED:
            return 1;
        case __TASK_TRACED:
            return 2;
        case TASK_STOPPED:
            return 2;
        case EXIT_ZOMBIE:
            return 3;
        default:
            return 4;
        }
}


void escribir_proceso(struct seq_file *archivo, struct task_struct *task){
    #define Convert(x) ((x) << (PAGE_SHIFT - 10))
    seq_printf(archivo, "\"PID\": \"%d\",\n \"Nombre\": \"%s\",\n \"Memoria\": \"%ld\",\n \"Usuario\": \"%d\",\n \"Estado\": \"%s\"", task->pid, task->comm, Convert(get_mm_rss(task->mm)), __kuid_val(task->real_cred->uid), get_task_state(task->state));
    #undef k
}

static int generar_json(struct seq_file *archivo, void *v){
    //Metodo con el que genero mi formato json para el modulo de cpu, contiene informacion de los procesos y de sus hijos.
    //contadores de procesos
    int inicio = 0;
    int inicio_hijos = 0;
    int estado = -1;

    int cont_task_running = 0;
    int cont_task_interr = 0;
    int cont_task_stopped = 0;
    int cont_task_zombie = 0;
    int cont_task_undefined = 0;

    int cont_procesos = 0;

    si_meminfo(&inf);

    #define Convert(x) ((x) << (PAGE_SHIFT - 10))
    seq_printf(archivo, "{\n \"Totalmemo\": %ld, \n", Convert(inf.totalram)); 
    #undef k
    seq_printf(archivo, " \"Tasks\": [\n");
    for_each_process(task){
        if(task->mm){
            
            if(inicio == 0){
                inicio = inicio + 1;
            }else{
                seq_printf(archivo,",\n");
            }
            
            cont_procesos = cont_procesos + 1;

            seq_printf(archivo, "{\n");
            escribir_proceso(archivo, task);
            estado = get_task_state_id(task->state);

            if(estado == 0){
                cont_task_running = cont_task_running + 1;
            }else if(estado == 1){
                cont_task_interr = cont_task_interr + 1;
            }else if(estado == 2){
                cont_task_stopped = cont_task_stopped + 1;
            }else if(estado == 3){
                cont_task_zombie = cont_task_zombie + 1;
            }else{
                cont_task_undefined = cont_task_undefined + 1;
            }

            inicio_hijos = 0;
            list_for_each(list, &task->children){
                if(inicio_hijos == 0){
                    seq_printf(archivo, ",\n\"Children\": [\n{\n");
                    inicio_hijos = inicio_hijos + 1;
                }else{
                    seq_printf(archivo, ",\n{\n");
                }
                task_child = list_entry(list, struct task_struct, sibling);
                escribir_proceso(archivo,task_child);
                seq_printf(archivo, "\n}");
            }
            
            if(inicio_hijos != 0){
                seq_printf(archivo, "\n]\n");
            }

            seq_printf(archivo, "}");
        } 
    }
    seq_printf(archivo, "\n],\n");

    seq_printf(archivo, "\"Tasks_running\": %d,\n", cont_task_running);
    seq_printf(archivo, "\"Tasks_inter\": %d,\n", cont_task_interr);
    seq_printf(archivo, "\"Tasks_stopped\": %d,\n", cont_task_stopped);
    seq_printf(archivo, "\"Tasks_zombie\": %d,\n", cont_task_zombie);
    seq_printf(archivo, "\"Tasks_undefined\": %d,\n", cont_task_undefined);
    seq_printf(archivo, "\"Total_tasks\": %d \n", cont_procesos);
    
    seq_printf(archivo, "}\n");
    return 0;    
}


static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file,generar_json,NULL);
}

static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};



static int iniciar(void)
{
    proc_create("process_info",0,NULL,&operaciones);
    printk(KERN_INFO "%s", "CARGANDO MODULO\n");
    printk(KERN_INFO "grupo 23n");

    for_each_process(task){
        printk(KERN_INFO "\nPADRE PID %d PROCESO %s ESTADO %ld ", task->pid, task->comm, task->state);
        
        //printk(KERN_INFO "PID %d\t Nombre %s \t Memoria %ld \t Total Memoria: %d \t Estado %s \n", task->pid, task->comm, get_mm_rss(task->mm), pid_vnr(task_pgrp(task)), get_task_state(task->state));
        list_for_each(list, &task->children){
            task_child = list_entry(list, struct task_struct, sibling);
            printk(KERN_INFO "\nHIJO DE %s[%d] PID: %d PROCESO %s ESTADO %ld ", task->comm, task->pid, task_child->pid, task_child->comm, task_child->state);
        }
        printk("----------------------------------------");

    }

    printk(KERN_INFO "grupo 23\n");
    return 0;
}

static void salir(void){
    remove_proc_entry("process_info",NULL);
    printk(KERN_INFO "%s", "REMOVIENDO MODULO\n");

}

module_init(iniciar);
module_exit(salir);


MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Itera a traves de todos los procesos / procesos hijos en el sistema operativo.");
MODULE_AUTHOR("201408470");
